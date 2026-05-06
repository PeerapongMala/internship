using Azure;
using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.ResponseModels;
using BSS_API.Repositories;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Spreadsheet;
using System.ComponentModel;

namespace BSS_API.Services
{
    public class ReportService : IReportService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMasterUserService _userService;
        private readonly IMasterBanknoteTypeService _banknoteService;
        private readonly IMasterShiftService _shiftService;

        public ReportService(IUnitOfWork unitOfWork, IMasterUserService userService, IMasterBanknoteTypeService banknoteService, IMasterShiftService shiftService)
        {
            _unitOfWork = unitOfWork;
            _userService = userService;
            _banknoteService = banknoteService;
            _shiftService = shiftService;
        }

        public async Task<reportBankSummaryResponse> GetDataReport(reportBankSummaryRequest request)
        {

            // 1. ดึงข้อมูล ContainerPrepare พร้อม Include ที่จำเป็น (กรองที่ Repository แล้ว)
            var containerPrepares = await _unitOfWork.TransactionContainerPrepareRepos.GetContainerPrepareAsync(request);

            if (containerPrepares == null || !containerPrepares.Any())
            {
                return new reportBankSummaryResponse
                {
                    ReportTitle = "Bank Summary Report",
                    BankSummaries = new List<BankDetail>()
                };
            }

            var bankDictionary = new Dictionary<string, BankDetail>();

            foreach (var container in containerPrepares)
            {
                if (container.TransactionPreparation == null) continue;

                foreach (var prep in container.TransactionPreparation)
                {
                    // ใช้ชื่อสถาบัน หรือ "Unknown"
                    string bankName = prep.MasterInstitution?.InstitutionNameTh ?? "Unknown";

                    if (!bankDictionary.TryGetValue(bankName, out var bankDetail))
                    {
                        bankDetail = new BankDetail
                        {
                            BankName = bankName,
                            Denominations = new List<DenomDetail>()
                            // อนึ่ง: หากต้องการข้อมูล Bank Level รวม สามารถ Initialize ค่าที่นี่ได้
                        };
                        bankDictionary.Add(bankName, bankDetail);
                    }

                    // คำนวณมูลค่าธนบัตร
                    decimal price = prep.MasterDenomination?.DenominationPrice ?? 0;


                    var reconciles = prep.TransactionReconcileTran?.TransactionReconcile ?? new List<TransactionReconcile>();

                    // --- แก้ไข: ดึงข้อมูลการกรองชนิดราคา/แบบ ---
                    // สมมติว่ามีฟิลด์เหล่านี้ใน prep.TransactionPreparation
                    // หากไม่มีให้แทนด้วย 0 หรือค่า default
                    // ใช้โค้ดจากตารางที่คุุณให้มา (G, B, R, D, C, T, L, E)
                    int goodQty = reconciles.Count(r => r.BnType == "G"); // ธนบัตรดี
                    int badQty = reconciles.Count(r => r.BnType == "B"); // ธนบัตรเสีย
                    int rejectQty = reconciles.Count(r => r.BnType == "R"); // ธนบัตร Reject
                    int destroyQty = reconciles.Count(r => r.BnType == "D"); // ธนบัตรทำลาย
                    int counterfeitQty = reconciles.Count(r => r.BnType == "C"); // ธนบัตรปลอม
                    int mutilatedQty = reconciles.Count(r => r.BnType == "T"); // ธนบัตรชำรุด

                    // คำนวณ Qty รวมก่อนปรับ (Good + Bad + Reject + Destroy + Counterfeit + Mutilated)
                    int totalQtyBefore = goodQty + badQty + rejectQty + destroyQty + counterfeitQty + mutilatedQty;
                    decimal totalValueBefore = totalQtyBefore * price;

                    // ข้อมูลการปรับยอด (ขาด/เกิน) อาจมาจากฟิลด์อื่นๆ หรือประเภท L/E
                    int shortQty = reconciles.Count(r => r.BnType == "L");
                    int excessQty = reconciles.Count(r => r.BnType == "E");
                    int totalQtyAfter = totalQtyBefore + excessQty - shortQty;
                    decimal totalValueAfter = totalQtyAfter * price;

                    // --- แก้ไข: หา DenomDetail หรือสร้างใหม่ ---
                    // ใช้ price.ToString() เพื่อระบุชนิดราคา
                    var denomKey = price.ToString("N0");
                    var denomDetail = bankDetail.Denominations.FirstOrDefault(d => d.DenominationValue == denomKey);

                    if (denomDetail == null)
                    {
                        denomDetail = new DenomDetail
                        {
                            DenominationValue = denomKey,
                            // Initialize ค่าเพื่อรวม
                            TotalQtyBeforeAdjust = 0,
                            TotalValueBeforeAdjust = 0
                        };
                        bankDetail.Denominations.Add(denomDetail);
                    }

                    // --- แก้ไข: สะสมข้อมูลลงในระดับ Denomination ---
                    denomDetail.GoodQty += goodQty;
                    denomDetail.BadQty += badQty;
                    denomDetail.RejectQty += rejectQty;
                    denomDetail.DestroyQty += destroyQty;
                    denomDetail.CounterfeitQty += counterfeitQty;
                    denomDetail.MutilatedQty += mutilatedQty;
                    denomDetail.TotalQtyBeforeAdjust += totalQtyBefore;
                    denomDetail.TotalValueBeforeAdjust += totalValueBefore;
                    denomDetail.ShortQty += shortQty;
                    denomDetail.ExcessQty += excessQty;
                    denomDetail.TotalQtyAfterAdjust += totalQtyAfter;
                    denomDetail.TotalValueAfterAdjust += totalValueAfter;

                    // --- แก้ไข: สะสมข้อมูลรวมระดับ Bank ---
                    bankDetail.GoodQty += goodQty;
                    bankDetail.BadQty += badQty;
                    bankDetail.RejectQty += rejectQty;
                    bankDetail.DestroyQty += destroyQty;
                    bankDetail.CounterfeitQty += counterfeitQty;
                    bankDetail.MutilatedQty += mutilatedQty;
                    bankDetail.TotalQtyBeforeAdjust += totalQtyBefore;
                    bankDetail.TotalValueBeforeAdjust += totalValueBefore;
                    bankDetail.ShortQty += shortQty;
                    bankDetail.ExcessQty += excessQty;
                    bankDetail.TotalQtyAfterAdjust += totalQtyAfter;
                    bankDetail.TotalValueAfterAdjust += totalValueAfter;
                }
            }

            // --- แก้ไข: สร้าง Grand Total ---
            var grandTotal = new BankDetail { BankName = "รวมทั้งหมด" };
            foreach (var bank in bankDictionary.Values)
            {
                grandTotal.GoodQty += bank.GoodQty;
                grandTotal.BadQty += bank.BadQty;
                grandTotal.RejectQty += bank.RejectQty;
                grandTotal.DestroyQty += bank.DestroyQty;
                grandTotal.CounterfeitQty += bank.CounterfeitQty;
                grandTotal.MutilatedQty += bank.MutilatedQty;
                grandTotal.TotalQtyBeforeAdjust += bank.TotalQtyBeforeAdjust;
                grandTotal.TotalValueBeforeAdjust += bank.TotalValueBeforeAdjust;
                grandTotal.ShortQty += bank.ShortQty;
                grandTotal.ExcessQty += bank.ExcessQty;
                grandTotal.TotalQtyAfterAdjust += bank.TotalQtyAfterAdjust;
                grandTotal.TotalValueAfterAdjust += bank.TotalValueAfterAdjust;
            }


            var firstContainer = containerPrepares.FirstOrDefault();
            var firstPrep = firstContainer?.TransactionPreparation?.FirstOrDefault();
            // สมมติว่ามีฟิลด์สำหรับเก็บชื่อ User ใน navigation property (หรือต้องใช้ ID ไปหาชื่อทีหลัง)
            var firstReconcile = firstPrep?.TransactionReconcileTran?.TransactionReconcile?.FirstOrDefault();

            // 3. สร้าง Response พร้อมข้อมูลครบถ้วน
            var result = new reportBankSummaryResponse
            {
                ReportTitle = "Bank Summary Report",

                // MachineName: ใช้ Ternary เพื่อเช็ค "all" (ถูกต้องแล้ว)
                MachineName = request.MachineId.ToLower() == "all"
                                ? "รวมทุกเครื่อง"
                                : (firstContainer?.MasterMachine?.MachineName ?? "Unknown"),

                PrintDate = DateTime.Now,
                WorkDate = Convert.ToDateTime(request.Date),
                BankSummaries = bankDictionary.Values.ToList(),
                GrandTotal = grandTotal,

                // --- ส่วนที่แนะนำให้เพิ่มเพื่อเติมข้อมูล Header ให้ครบถ้วน ---

                // ReconciledBy: ดึงข้อมูลจากรายการแรก (ถ้ามี)
                ReconciledBy = GetUserName(firstReconcile?.CreatedBy.ToString()) ?? "-",

                // InstitutionName: ดึงจาก MasterInstitution ของรายการแรก
                InstitutionName = firstPrep?.MasterInstitution?.InstitutionNameTh ?? "-",

                // DenominationType: ถ้า request เป็น "all" ให้แสดงคำว่า "All"
                DenominationType = request.DenominationId.ToLower() == "all" ? "ทั้งหมด" : request.DenominationId,

                // BranchName และ Shift: ดึงจาก request
                BranchName = GetCashTypeName(Convert.ToInt16(request.CashTypeId)),
                Shift = GetShiftName(request.shift),

                // PreparedBy, OperatorName, SupervisorName:
                // ดึงจาก TransactionPreparation หรือข้อมูล User Session
                PreparedBy = GetUserName(firstContainer?.CreatedBy?.ToString()) ?? "-",
                OperatorName = "", // ต้องดึงจาก Session หรือ DB
                SupervisorName = "", // ต้องดึงจาก Session หรือ DB
                                     // --------------------------------------------------------
            };

            return result;

        }

        private string GetUserName(string userId)
        {
            // 1. เช็ค null/empty ก่อน
            if (string.IsNullOrEmpty(userId))
            {
                return "-";
            }

            // 2. แปลงประเภทข้อมูลอย่างปลอดภัย
            if (!int.TryParse(userId, out int parsedId))
            {
                return userId; // หรือ return "-" ถ้าค่า userId ไม่ใช่ตัวเลข
            }

            // 3. ดึงข้อมูลครั้งเดียวและเก็บไว้ในตัวแปร
            var userTask = _userService.GetUserById(parsedId);
            var user = userTask.Result; // ควรใช้ await ใน async method แทนที่จะใช้ .Result

            // 4. เช็ค null ของข้อมูลผู้ใช้ก่อนเข้าถึง Property
            if (user == null)
            {
                return "-";
            }

            // 5. คืนค่าชื่อจริง (เติมช่องว่างระหว่างชื่อกับนามสกุล)
            return $"{user.FirstName} {user.LastName}";
        }

        private string GetShiftName(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return "-";
            }

            // --- วิธีที่ปลอดภัยในการเรียก Task แบบ Sync ---
            // ใช้ Task.Run ร่วมกับ .Result เพื่อหลีกเลี่ยง Deadlock ในบางบริบท
            var shifts = Task.Run(() => _shiftService.GetShiftByUniqueOrKey(code)).Result;

            // --- แก้ไขตรงนี้: ใช้ FirstOrDefault เพื่อดึงรายการเดียวออกมาจาก List ---
            var shift = shifts.FirstOrDefault();

            if (shift == null || string.IsNullOrEmpty(shift.ShiftName))
            {
                return "-";
            }

            return shift.ShiftName;
        }

        private string GetCashTypeName(int code)
        {
            // 1. ดึงข้อมูลแบบ Sync อย่างปลอดภัย
            var banknoteType = Task.Run(() => _banknoteService.GetBanknoteTypeById(code)).Result;

            // 2. ตรวจสอบว่า banknoteType เป็น null หรือไม่ก่อนเข้าถึง Property
            if (banknoteType == null || string.IsNullOrEmpty(banknoteType.BanknoteTypeName))
            {
                return "-"; // หรือ return ค่าเริ่มต้นอื่นๆ
            }

            // 3. คืนค่าชื่อ
            return banknoteType.BanknoteTypeName;
        }

        public async Task<reportCashPointCenterResponse> GetDataReport_CashPointCashCenter(reportCashPointCenterRequest request)
        {
            var containerPrepares = await _unitOfWork.TransactionContainerPrepareRepos.GetContainerPrepare_CashPointCenterAsync(request);

            var response = new reportCashPointCenterResponse
            {
                ReportTitle = "Cashpoint/Cashcenter Report",
                WorkDate = Convert.ToDateTime(request.Date),
                PrintDate = DateTime.Now,
                MachineName = request.MachineId.ToLower() == "all" ? "รวมทุกเครื่อง" : (containerPrepares.FirstOrDefault()?.MasterMachine?.MachineName ?? "Unknown"),
                DenominationType = request.DenominationId.ToLower() == "all" ? "ทั้งหมด" : request.DenominationId,
                Shift = request.Shift ?? "ทั้งวัน",
                CashType = GetCashTypeName(Convert.ToInt16(request.CashTypeId)),
                ReportData = new CashPointReportViewModel
                {
                    Institutions = new List<InstitutionGroup>(),
                    GrandTotal = new TotalSummary()
                }
            };

            if (containerPrepares == null || !containerPrepares.Any()) return response;

            // 1. กระจายข้อมูลออกมาเป็น Flat List ก่อนเพื่อให้ง่ายต่อการ Grouping
            var flatData = new List<CashPointCenterRecord>();

            foreach (var container in containerPrepares)
            {
                if (container.TransactionPreparation == null) continue;

                foreach (var prep in container.TransactionPreparation)
                {
                    var reconciles = prep.TransactionReconcileTran?.TransactionReconcile ?? new List<TransactionReconcile>();
                    decimal price = prep.MasterDenomination?.DenominationPrice ?? 0;

                    var record = new CashPointCenterRecord
                    {
                        InstitutionName = prep.MasterInstitution?.InstitutionNameTh ?? "-",
                        CashCenterName = prep.MasterCashCenter?.CashCenterName ?? "-",
                        ZoneName = prep.MasterZone?.ZoneName ?? "-",
                        CashPointName = prep.MasterCashPoint?.CashpointName ?? "-",
                        Denomination = price,

                        // Mapping ตาม BnType
                        GoodAmount = reconciles.Count(r => r.BnType == "G"),
                        BadAmount = reconciles.Count(r => r.BnType == "B"),
                        RejectAmount = reconciles.Count(r => r.BnType == "R"),
                        DestroyAmount = reconciles.Count(r => r.BnType == "D"),
                        CounterfeitAmount = reconciles.Count(r => r.BnType == "C"),
                        DamagedAmount = reconciles.Count(r => r.BnType == "T"),
                        ShortAmount = reconciles.Count(r => r.BnType == "L"),
                        OverAmount = reconciles.Count(r => r.BnType == "E")
                    };

                    record.PreAdjustTotal = record.GoodAmount + record.BadAmount + record.RejectAmount + record.DestroyAmount + record.CounterfeitAmount + record.DamagedAmount;
                    record.FinalTotal = record.PreAdjustTotal + record.OverAmount - record.ShortAmount;
                    record.FinalValue = record.FinalTotal * price;

                    flatData.Add(record);
                }
            }

            // 2. ใช้ LINQ ในการ Group ข้อมูลเข้า Hierarchy (Institution > Zone > Denomination)
            // 2. ใช้ LINQ ในการ Group ข้อมูลเข้า Hierarchy (Institution > Zone > Denomination)
            response.ReportData.Institutions = flatData
                .GroupBy(i => i.InstitutionName)
                .Select(instGroup => new InstitutionGroup
                {
                    InstitutionName = instGroup.Key,
                    Zones = instGroup.GroupBy(z => z.ZoneName)
                        .Select(zoneGroup => new ZoneGroup
                        {
                            ZoneName = zoneGroup.Key,
                            CashCenterName = zoneGroup.First().CashCenterName,
                            CashPointName = zoneGroup.First().CashPointName,
                            Denominations = zoneGroup.GroupBy(d => d.Denomination)
                                .Select(denomGroup => new DenominationGroup
                                {
                                    Denomination = denomGroup.Key,
                                    // แก้จุดนี้: Group ตาม Cashpoint อีกครั้งเพื่อยุบรวม record ที่ซ้ำกัน
                                    Details = denomGroup.GroupBy(cp => cp.CashPointName)
                                        .Select(cpGroup => new CashPointSummary
                                        {
                                            //InstitutionName = instGroup.Key,
                                            ZoneName = zoneGroup.Key,
                                            CashCenterName = cpGroup.First().CashCenterName,
                                            CashPointName = cpGroup.Key,
                                            //Denomination = denomGroup.Key,

                                            // ทำการ Sum ข้อมูลจากทุกถุง/ทุกใบงาน ของ Cashpoint นี้
                                            GoodAmount = cpGroup.Sum(x => x.GoodAmount),
                                            BadAmount = cpGroup.Sum(x => x.BadAmount),
                                            RejectAmount = cpGroup.Sum(x => x.RejectAmount),
                                            DestroyAmount = cpGroup.Sum(x => x.DestroyAmount),
                                            CounterfeitAmount = cpGroup.Sum(x => x.CounterfeitAmount),
                                            DamagedAmount = cpGroup.Sum(x => x.DamagedAmount),
                                            PreAdjustTotal = cpGroup.Sum(x => x.PreAdjustTotal),
                                            ShortAmount = cpGroup.Sum(x => x.ShortAmount),
                                            OverAmount = cpGroup.Sum(x => x.OverAmount),
                                            FinalTotal = cpGroup.Sum(x => x.FinalTotal),
                                            FinalValue = cpGroup.Sum(x => x.FinalValue)
                                        }).ToList()
                                }).OrderByDescending(o => o.Denomination).ToList()
                        }).ToList()
                }).ToList();

            // 3. คำนวณ Summation (Helper function สำหรับคำนวณผลรวมในแต่ละระดับ)
            CalculateTotals(response.ReportData);

            return response;
        }

        private void CalculateTotals(CashPointReportViewModel model)
        {
            foreach (var inst in model.Institutions)
            {
                foreach (var zone in inst.Zones)
                {
                    foreach (var denom in zone.Denominations)
                    {
                        SumToTotal(denom, denom.Details); // รวมระดับ Denom
                    }
                    SumToTotal(zone, zone.Denominations); // รวมระดับ Zone
                }
                SumToTotal(inst, inst.Zones); // รวมระดับ Inst
            }
            SumToTotal(model.GrandTotal, model.Institutions); // รวมระดับ Grand Total
        }

        private void SumToTotal<T>(TotalSummary target, IEnumerable<T> source) where T : TotalSummary
        {
            target.TotalGood = source.Sum(s => s.TotalGood);
            target.TotalBad = source.Sum(s => s.TotalBad);
            target.TotalReject = source.Sum(s => s.TotalReject);
            target.TotalDestroy = source.Sum(s => s.TotalDestroy);
            target.TotalCounterfeit = source.Sum(s => s.TotalCounterfeit);
            target.TotalDamaged = source.Sum(s => s.TotalDamaged);
            target.TotalPreAdjust = source.Sum(s => s.TotalPreAdjust);
            target.TotalShort = source.Sum(s => s.TotalShort);
            target.TotalOver = source.Sum(s => s.TotalOver);
            target.TotalFinalAmount = source.Sum(s => s.TotalFinalAmount);
            target.TotalValue = source.Sum(s => s.TotalValue);
        }

        // Overload สำหรับระดับล่างสุด (List<CashPointCenterRecord>)
        private void SumToTotal(TotalSummary target, List<CashPointCenterRecord> details)
        {
            target.TotalGood = details.Sum(d => d.GoodAmount);
            target.TotalBad = details.Sum(d => d.BadAmount);
            target.TotalReject = details.Sum(d => d.RejectAmount);
            target.TotalDestroy = details.Sum(d => d.DestroyAmount);
            target.TotalCounterfeit = details.Sum(d => d.CounterfeitAmount);
            target.TotalDamaged = details.Sum(d => d.DamagedAmount);
            target.TotalPreAdjust = details.Sum(d => d.PreAdjustTotal);
            target.TotalShort = details.Sum(d => d.ShortAmount);
            target.TotalOver = details.Sum(d => d.OverAmount);
            target.TotalFinalAmount = details.Sum(d => d.FinalTotal);
            target.TotalValue = details.Sum(d => d.FinalValue);
        }

        public async Task<IEnumerable<DropdownItemResponse>> GetHeaderCardListAsync(reportGetHeaderCardListRequest request)
        {
            try
            {
                // 1. ตรวจสอบวันที่ ถ้า Parse ไม่ผ่านให้คืนค่าว่าง (Empty List)
                if (!DateTime.TryParse(request.Date, out DateTime date))
                {
                    return Enumerable.Empty<DropdownItemResponse>();
                }

                // 2. เรียก Repository และคืนค่าออกไปโดยตรง
                // Repository คืนค่าเป็น IEnumerable<DropdownItemResponse> อยู่แล้ว จึง Match กันพอดี
                return await _unitOfWork.TransactionPreparationRepos
                    .GetHeaderCardByCriteriaAsync(request.MachineId.ToString(), date);
            }
            catch (Exception ex)
            {
                // Log error ตรงนี้ตามความเหมาะสม
                Console.WriteLine(ex.Message);

                // กรณีเกิด Error ให้คืนค่ารายการว่าง เพื่อไม่ให้ฝั่ง Frontend พัง
                return Enumerable.Empty<DropdownItemResponse>();
            }
        }

        public async Task<reportSingleHeaderCardResponse> GetDataReport_SingleHeaderCard(reportSingleHeaderCardRequest request)
        {
            // 1. ดึงข้อมูลดิบจาก DB (เรียกใช้ Method ที่เราแก้ Error ไปก่อนหน้า)
            var rawData = await _unitOfWork.TransactionPreparationRepos.GetPrepareSingleHeaderCardAsync(request);

            // 2. ตรวจสอบข้อมูลเบื้องต้น
            if (rawData == null || !rawData.Any())
            {
                return new reportSingleHeaderCardResponse
                {
                    PrintDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH"))
                };
            }

            // 3. ดึงข้อมูลส่วนกลาง (Common Header) จาก Record แรก
            var first = rawData.First();
            var container = first.TransactionContainerPrepare;

            var response = new reportSingleHeaderCardResponse
            {
                // --- ข้อมูลหัวรายงาน ---
                PrintDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                CountingDate = first.PrepareDate.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                MachineName = container?.MasterMachine?.MachineName ?? "-",
                BundleBarcode = first.BundleCode,
                BankName = first.MasterInstitution?.BankCode ?? "-",
                CashCenter = first.MasterCashCenter?.CashCenterName ?? "-",
                CashPoint = first.MasterCashPoint?.CashpointName ?? "-",
                Zone = first.MasterZone?.ZoneName ?? "-",
                CashType = container?.MasterBanknoteType?.BanknoteTypeName ?? "-", // เช่น Unfit
                Shift = "ทั้งวัน", // สามารถปรับตาม Business Logic ของผลัดงาน
                HeaderCardNo = first.HeaderCardCode,
                PackBarcode = first.PackageCode,

                // --- ผู้รับผิดชอบ (ดึงจาก Entity ที่มีอยู่จริง) ---
                OperatorPrepare = first.CreatedByUser?.FirstName ?? "-",
                OperatorSorter = first.CreatedByUser?.FirstName ?? "-",
                // เนื่องจากใน ReconcileTran ไม่มี ReconcileByUser ให้ดึงจากข้อมูลที่มี หรือใส่เป็น "-" ไว้ก่อน
                OperatorReconcile = "-",
                Supervisor = "-",

                // --- ส่วนรายละเอียดในตาราง (Grouping ตาม Model SingleDenominationGroup) ---
                ReportDetails = rawData
                    .GroupBy(x => new { x.DenoId, x.MasterDenomination?.DenominationPrice })
                    .OrderBy(g => g.Key.DenominationPrice)
                    .Select(g => new SingleDenominationGroup
                    {
                        Denomination = g.Key.DenominationPrice.ToString() ?? "N/A",
                        SeriesDetails = g.Select(s => new HeaderCardRowDetail
                        {
                            Series = s.TransactionReconcileTran?.TransactionReconcile.FirstOrDefault().DenomSeries ?? "-",

                            // ข้อมูลจำนวน (Qty) ดึงจาก TransactionReconcileTran
                            // หมายเหตุ: ปรับ Field ตามชื่อที่มีใน bss_txn_reconcile_tran (เช่น ReconcileQty)
                            GoodAmount = s.TransactionReconcileTran?.ReconcileQty ?? 0,
                            BadAmount = 0, // หากต้องแยก ดี/เสีย ต้อง Join ไปที่ตาราง TransactionReconcile เพิ่ม
                            RejectAmount = 0,

                            TotalBeforeAdjust = s.Qty, // ยอดที่พนักงานเตรียมนับ (Prepare Qty)
                            ValueBeforeAdjust = s.Qty * (s.MasterDenomination?.DenominationPrice ?? 0),

                            // ยอดหลังปรับ (ยอดที่ผ่านเครื่องนับ)
                            TotalAfterAdjust = s.TransactionReconcileTran?.ReconcileQty ?? 0,
                            TotalValueAfterAdjust = (s.TransactionReconcileTran?.ReconcileQty ?? 0) * (s.MasterDenomination?.DenominationPrice ?? 0)
                        }).ToList()
                    }).ToList()
            };

            return response;
        }

        public async Task<reportMultiHeaderCardResponse> GetDataReport_MultiHeaderCard(reportMultiHeaderCardRequest request)
        {
            // 1. ดึงข้อมูลดิบจาก DB (เรียกใช้ Method ที่เราแก้ Error ไปก่อนหน้า)
            var rawData = await _unitOfWork.TransactionPreparationRepos.GetPrepareMultiHeaderCardAsync(request);

            // 2. ตรวจสอบข้อมูลเบื้องต้น
            if (rawData == null || !rawData.Any())
            {
                return new reportMultiHeaderCardResponse
                {
                    PrintDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH"))
                };
            }

            // 3. ดึงข้อมูลส่วนกลาง (Common Header) จาก Record แรก
            var first = rawData.First();
            var container = first.TransactionContainerPrepare;

            var response = new reportMultiHeaderCardResponse
            {
                // --- ข้อมูลหัวรายงาน ---
                PrintDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                CountingDate = first.PrepareDate.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                MachineName = container?.MasterMachine?.MachineName ?? "-",
                

                // --- ผู้รับผิดชอบ (ดึงจาก Entity ที่มีอยู่จริง) ---
                OperatorPrepare = first.CreatedByUser?.FirstName ?? "-",
                OperatorSorter = first.CreatedByUser?.FirstName ?? "-",
                // เนื่องจากใน ReconcileTran ไม่มี ReconcileByUser ให้ดึงจากข้อมูลที่มี หรือใส่เป็น "-" ไว้ก่อน
                OperatorReconcile = "-",
                Supervisor = "-",

                
            };

            return response;
        }

        public async Task<reportContainerResponse> GetDataReport_Container(reportContainerRequest request)
        {



            var response = new reportContainerResponse
            {
                // --- ข้อมูลหัวรายงาน ---
                PrintDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                CountingDate = "",//first.PrepareDate.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                MachineName = "",//container?.MasterMachine?.MachineName ?? "-",

                BankName = "",//first.MasterInstitution?.BankCode ?? "-",

                Shift = "ทั้งวัน", // สามารถปรับตาม Business Logic ของผลัดงาน


                // --- ผู้รับผิดชอบ (ดึงจาก Entity ที่มีอยู่จริง) ---
                OperatorPrepare = "",//first.CreatedByUser?.FirstName ?? "-",
                OperatorSorter = "",//first.CreatedByUser?.FirstName ?? "-",
                // เนื่องจากใน ReconcileTran ไม่มี ReconcileByUser ให้ดึงจากข้อมูลที่มี หรือใส่เป็น "-" ไว้ก่อน
                OperatorReconcile = "-",
                Supervisor = "-",

                // --- ส่วนรายละเอียดในตาราง (Grouping ตาม Model SingleDenominationGroup) ---

            };

            return response;
        }

        public async Task<reportAbnormalResponse> GetDataReport_Abnormal(reportAbnormalRequest request)
        {
            

            var response = new reportAbnormalResponse
            {
                // --- ข้อมูลหัวรายงาน ---
                PrintDate = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                CountingDate = "",//first.PrepareDate.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("th-TH")),
                MachineName = "",//container?.MasterMachine?.MachineName ?? "-",

                BankName = "",//first.MasterInstitution?.BankCode ?? "-",
                CashCenter = "",//first.MasterCashCenter?.CashCenterName ?? "-",

                Shift = "ทั้งวัน", // สามารถปรับตาม Business Logic ของผลัดงาน
              
                // --- ผู้รับผิดชอบ (ดึงจาก Entity ที่มีอยู่จริง) ---
                OperatorPrepare = "",
                OperatorSorter = "",
                // เนื่องจากใน ReconcileTran ไม่มี ReconcileByUser ให้ดึงจากข้อมูลที่มี หรือใส่เป็น "-" ไว้ก่อน
                OperatorReconcile = "-",
                Supervisor = "-",

               
            };

            return response;
        }
    }
}