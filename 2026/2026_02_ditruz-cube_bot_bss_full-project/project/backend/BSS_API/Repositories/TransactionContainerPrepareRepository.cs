namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Models.ObjectModels;
    using Microsoft.EntityFrameworkCore;

    public class TransactionContainerPrepareRepository(ApplicationDbContext db)
        : GenericRepository<TransactionContainerPrepare>(db),
            ITransactionContainerPrepareRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<TransactionContainerPrepare?> GetContainerPrepareByIdAsync(int containerPrepareId)
        {
            IQueryable<TransactionContainerPrepare> query = _db.TransactionContainerPrepares.AsQueryable()
                .Where(w => w.ContainerPrepareId == containerPrepareId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<TransactionContainerPrepare?> GetContainerPrepareByIdAsync(long containerPrepareId)
        {
            var data = await _db.TransactionContainerPrepares
                .Include(x => x.ReceiveCbmsDataTransaction)
                .Include(d => d.MasterDepartment)
                .Include(m => m.MasterMachine)
                .Include(b => b.MasterBanknoteType)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ContainerPrepareId == containerPrepareId);

            return data;
        }

        public async Task<ICollection<TransactionContainerPrepare>> GetContainerPrepareWithMachineAsync(
            string containerCode, int departmentId, int machineId, DateTime startDateTime, DateTime endDateTime)
        {
            return await _db.TransactionContainerPrepares
                .Include(i => i.MasterMachine)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.MasterInstitution)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.MasterCashCenter)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.MasterCashPoint)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.MasterZone)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.MasterDenomination)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.CreatedByUser)
                .Include(i => i.TransactionPreparation)
                .ThenInclude(ii => ii.UpdatedByUser)
                .Where(w => w.ContainerCode == containerCode &&
                            w.DepartmentId == departmentId &&
                            (w.MachineId != machineId && w.MachineId != null) && w.IsActive == true)
                .Where(i => i.TransactionPreparation.Any(j => j.IsReconcile == false))
                .AsNoTracking()
                .AsQueryable()
                .ToListAsync();
        }

        public async Task<IEnumerable<TransactionContainerPrepareViewDisplay>> GetAllContainerPrepareAsync(
            int department)
        {
            var data = await _db.TransactionContainerPrepares
                .Include(x => x.ReceiveCbmsDataTransaction)
                .Include(x => x.MasterDepartment)
                .Include(x => x.MasterMachine)
                .Include(x => x.MasterBanknoteType)
                .AsNoTracking()
                .Where(x => x.DepartmentId == department)
                .Select(x => new TransactionContainerPrepareViewDisplay
                {
                    ContainerPrepareId = x.ContainerPrepareId,
                    DepartmentName = x.MasterDepartment.DepartmentName,
                    MachineName = x.MasterMachine.MachineName,
                    BanknoteTypeName = x.MasterBanknoteType.BanknoteTypeName,
                    ContainerCode = x.ContainerCode,

                    // 🟩 ดึงหลาย column จาก ReceiveCbmsDataTransaction
                    BnTypeInput = x.ReceiveCbmsDataTransaction.BnTypeInput,
                    ContainerId = x.ReceiveCbmsDataTransaction.ContainerId,
                    BarCode = x.ReceiveCbmsDataTransaction.BarCode,
                    Qty = x.ReceiveCbmsDataTransaction.Qty,
                    RemainingQty = x.ReceiveCbmsDataTransaction.RemainingQty,
                    UnfitQty = x.ReceiveCbmsDataTransaction.UnfitQty
                })
                .ToListAsync();

            return data;
        }

        public async Task<TransactionContainerPrepare?>
            GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(
                long receiveId,
                int institutionId, int denominationId, int? cashCenterId = null, string? barcode = null , int? cashPointId = null)
        {
            IQueryable<TransactionContainerPrepare> query = _db.TransactionContainerPrepares
                .Include(x => x.TransactionPreparation)
                .Where(w => w.ReceiveId == receiveId && w.IsActive == true)
                .Where(w => w.TransactionPreparation.All(a => a.InstId == institutionId &&
                                                              a.DenoId == denominationId))
                .AsQueryable();

            if (cashCenterId.HasValue)
            {
                query = query.Where(a => a.TransactionPreparation.All(all => all.CashcenterId == cashCenterId));
            }

            if (cashPointId.HasValue)
            {
                query = query.Where(a => a.TransactionPreparation.All(all => all.CashpointId == cashPointId));
            }

            if (!string.IsNullOrWhiteSpace(barcode))
            {
                query = query.Where(a => a.TransactionPreparation.All(all => all.PackageCode == barcode));
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<TransactionContainerPrepare?>
            GetTransactionContainerPrepareAndIncludePrepareWithContainerIdAsync(
                long containerPrepareId,
                int institutionId, int denominationId)
        {
            return await _db.TransactionContainerPrepares
                .Include(x => x.TransactionPreparation)
                .Where(w => w.ContainerPrepareId == containerPrepareId && w.IsActive == true)
                .Where(w => w.TransactionPreparation.All(a => a.InstId == institutionId &&
                                                              a.DenoId == denominationId))
                .AsQueryable()
                .FirstOrDefaultAsync();
        }


        //////////Get Report ny MarK 20260227/////////////
        /////////

        // เปลี่ยน return type จาก ICollection เป็น List เพื่อความชัดเจน
        public async Task<ICollection<TransactionContainerPrepare>> GetContainerPrepareAsync(reportBankSummaryRequest request)
        {
            // 1. สร้าง Base Query พร้อม AsNoTracking เพื่อประสิทธิภาพสูงสุดในงาน Report (Read-only)
            var query = _db.TransactionContainerPrepares
                .AsNoTracking()
                .Where(w => w.IsActive == true);

            // 2. Filter: MachineId
            if (!string.IsNullOrEmpty(request.MachineId) && request.MachineId.ToLower() != "all")
            {
                query = query.Where(c => c.MasterMachine.MachineId == Convert.ToInt32(request.MachineId));
            }

            // 3. Filter: วันที่ (รองรับ dd/MM/yyyy พ.ศ. จาก Frontend)
            if (!string.IsNullOrEmpty(request.Date))
            {
                if (DateTime.TryParseExact(request.Date, "dd/MM/yyyy",
                    new System.Globalization.CultureInfo("th-TH"),
                    System.Globalization.DateTimeStyles.None, out DateTime filterDate))
                {
                    // เทียบเฉพาะวันที่ ไม่เอาเวลา
                    query = query.Where(c => c.CreatedDate.Date == filterDate.Date);
                }
            }

            // 4. กรองระดับ Parent: เอาเฉพาะ Container ที่มีรายการลูกตรงตามเงื่อนไข (Institution, CashType, Denom)
            query = query.Where(container => container.TransactionPreparation.Any(p =>
                p.IsReconcile == false &&
                (request.InstitutionId == "all" || p.InstId == Convert.ToInt16(request.InstitutionId)) &&
                (request.DenominationId == "all" || p.DenoId == Convert.ToInt16(request.DenominationId)) &&
                (request.CashTypeId == "all" || p.TransactionContainerPrepare.BntypeId == Convert.ToInt16(request.CashTypeId))
            ));

            // 5. โหลดข้อมูลแบบ Eager Loading พร้อม Filtered Include และ Split Query
            return await query
                .AsSplitQuery() // สำคัญ: ช่วยลด Cartesian Product เพราะมี Include หลายตัว
                .Include(c => c.MasterMachine)
                // Filtered Include: โหลดเฉพาะรายการลูกที่ต้องการจริงๆ ขึ้นมาบน RAM
                .Include(c => c.TransactionPreparation.Where(p =>
                    p.IsReconcile == false &&
                    (request.InstitutionId == "all" || p.InstId == Convert.ToInt16(request.InstitutionId)) &&
                    (request.DenominationId == "all" || p.DenoId == Convert.ToInt16(request.DenominationId)) &&
                    (request.CashTypeId == "all" || p.TransactionContainerPrepare.BntypeId == Convert.ToInt16(request.CashTypeId))
                ))
                    .ThenInclude(p => p.MasterInstitution)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterDenomination)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterCashCenter)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterCashPoint)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterZone)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.CreatedByUser)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.UpdatedByUser)
                .ToListAsync();
        }


        public async Task<ICollection<TransactionContainerPrepare>> GetContainerPrepare_CashPointCenterAsync(reportCashPointCenterRequest request)
        {
            // 1. สร้าง Base Query พร้อม AsNoTracking เพื่อประสิทธิภาพสูงสุดในงาน Report (Read-only)
            var query = _db.TransactionContainerPrepares
                .AsNoTracking()
                .Where(w => w.IsActive == true);

            // 2. Filter: MachineId
            if (!string.IsNullOrEmpty(request.MachineId) && request.MachineId.ToLower() != "all")
            {
                query = query.Where(c => c.MasterMachine.MachineId == Convert.ToInt32(request.MachineId));
            }

            // 3. Filter: วันที่ (รองรับ dd/MM/yyyy พ.ศ. จาก Frontend)
            if (!string.IsNullOrEmpty(request.Date))
            {
                if (DateTime.TryParseExact(request.Date, "dd/MM/yyyy",
                    new System.Globalization.CultureInfo("th-TH"),
                    System.Globalization.DateTimeStyles.None, out DateTime filterDate))
                {
                    // เทียบเฉพาะวันที่ ไม่เอาเวลา
                    query = query.Where(c => c.CreatedDate.Date == filterDate.Date);
                }
            }

            // 4. กรองระดับ Parent: เอาเฉพาะ Container ที่มีรายการลูกตรงตามเงื่อนไข (Institution, CashType, Denom)
            query = query.Where(container => container.TransactionPreparation.Any(p =>
                p.IsReconcile == false &&
                (request.InstitutionId == "all" || p.InstId == Convert.ToInt16(request.InstitutionId)) &&
                (request.DenominationId == "all" || p.DenoId == Convert.ToInt16(request.DenominationId)) &&
                (request.CashTypeId == "all" || p.TransactionContainerPrepare.BntypeId == Convert.ToInt16(request.CashTypeId))
            ));

            // 5. โหลดข้อมูลแบบ Eager Loading พร้อม Filtered Include และ Split Query
            return await query
                .AsSplitQuery() // สำคัญ: ช่วยลด Cartesian Product เพราะมี Include หลายตัว
                .Include(c => c.MasterMachine)
                // Filtered Include: โหลดเฉพาะรายการลูกที่ต้องการจริงๆ ขึ้นมาบน RAM
                .Include(c => c.TransactionPreparation.Where(p =>
                    p.IsReconcile == false &&
                    (request.InstitutionId == "all" || p.InstId == Convert.ToInt16(request.InstitutionId)) &&
                    (request.DenominationId == "all" || p.DenoId == Convert.ToInt16(request.DenominationId)) &&
                    (request.CashTypeId == "all" || p.TransactionContainerPrepare.BntypeId == Convert.ToInt16(request.CashTypeId))
                ))
                    .ThenInclude(p => p.MasterInstitution)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterDenomination)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterCashCenter)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterCashPoint)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.MasterZone)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.CreatedByUser)
                .Include(c => c.TransactionPreparation)
                    .ThenInclude(p => p.UpdatedByUser)
                .ToListAsync();
        }





    }
}