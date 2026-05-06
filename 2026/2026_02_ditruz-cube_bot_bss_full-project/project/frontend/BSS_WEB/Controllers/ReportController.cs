namespace BSS_WEB.Controllers
{
    using BSS_WEB.Core.Constants;
    using BSS_WEB.Helpers;
    using BSS_WEB.Infrastructure;
    using BSS_WEB.Interfaces;
    using BSS_WEB.Models;
    using BSS_WEB.Models.Report;
    using BSS_WEB.Models.Report.Preparation;
    using BSS_WEB.Models.Report.RegisterUnsort;
    using BSS_WEB.Models.SearchModel;
    using BSS_WEB.Models.ServiceModel;
    using BSS_WEB.Services;
    using DocumentFormat.OpenXml.Spreadsheet;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Logging;
    using Microsoft.Playwright;
    using SixLabors.ImageSharp;
    using SixLabors.ImageSharp.Formats.Png;
    using SixLabors.ImageSharp.PixelFormats;
    using System.Threading.Tasks;
    using ZXing;
    using ZXing.Common;

    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class ReportController : BaseController
    {
        private readonly IAppShare _appShare;

        private readonly IReportService _reportService;

        private readonly ILogger<ReportController> _logger;
        private readonly IMasterMachineService _machineService;
        private readonly IMasterInstitutionService _institutionService;
        private readonly IMasterCashTypeService _cashtypeService;
        private readonly IMasterDenominationService _denominationService;
        private readonly IMasterShiftService _shifttimeService;
        private readonly IMasterBanknoteTypeService _banknotetypeService;
        private readonly IMasterCashCenterService _cashcenterService;
        private readonly IMasterCashPointService _cashpointService;
        private readonly IMasterZoneService _zoneService;

        private static IBrowser? _browser;
        private static IPlaywright? _playwright;
        private static IBrowserContext? _context;

        private static readonly SemaphoreSlim _lock = new(1, 1);
        private static readonly SemaphoreSlim _pdfSemaphore = new SemaphoreSlim(8);

        // รีไซเคิล browser ทุก X ครั้ง ป้องกัน memory โตสะสม
        private static int _pdfCounter = 0;
        private const int BrowserRecycleThreshold = 500;

        private readonly IMemoryCache _memoryCache;


        public ReportController(IAppShare appShare, ILogger<ReportController> logger, IReportService reportService, IMasterMachineService machineService,
            IMasterInstitutionService institutionService, IMasterCashTypeService cashtypeService, IMasterDenominationService denominationService,
            IMasterShiftService shifttimeService, IMasterBanknoteTypeService banknotetypeService, IMasterCashCenterService cashcenterService,
            IMasterCashPointService cashpointService, IMasterZoneService zoneService, IMemoryCache memoryCache) : base(appShare)
        {
            _logger = logger;
            _appShare = appShare;
            _reportService = reportService;
            _machineService = machineService;
            _institutionService = institutionService;
            _cashtypeService = cashtypeService;
            _denominationService = denominationService;
            _shifttimeService = shifttimeService;
            _banknotetypeService = banknotetypeService;
            _cashcenterService = cashcenterService;
            _cashpointService = cashpointService;
            _zoneService = zoneService;
            _memoryCache = memoryCache;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult BankSummary()
        {
            _logger.LogInformation("Action: BankSummary Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult CashPointCenter()
        {
            _logger.LogInformation("Action: CashPointCenter Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult SingleHeaderCard()
        {
            _logger.LogInformation("Action: SingleHeaderCard Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult MultiHeaderCard()
        {
            _logger.LogInformation("Action: MultiHeaderCard Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult Container()
        {
            _logger.LogInformation("Action: Container Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult Abnormal()
        {
            _logger.LogInformation("Action: Abnormal Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult MachineData()
        {
            _logger.LogInformation("Action: MachineData Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        public IActionResult OutofBalance()
        {
            _logger.LogInformation("Action: OutofBalance Report, Status: Loaded, User: {User}", User.Identity?.Name);
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetMachineList()
        {
            var machineResponse = await _machineService.GetMachineAllAsync();


            return Json(machineResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetInstitutionList()
        {
            var Response = await _institutionService.GetInstitutionsAllAsync();


            return Json(Response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashTypeList()
        {
            var Response = await _cashtypeService.GetAllMasterCashTypeAsyn();


            return Json(Response);
        }
        [HttpGet]
        public async Task<IActionResult> GetBanknoteTypeList()
        {
            var Response = await _banknotetypeService.GetAllBanknoteTypeAsyn();


            return Json(Response);
        }

        [HttpGet]
        public async Task<IActionResult> GetDenominationList()
        {
            var Response = await _denominationService.GetAllMasterDenominationAsyn();


            return Json(Response);
        }

        [HttpGet]
        public async Task<IActionResult> GetShiftTimeList()
        {
            var Response = await _shifttimeService.GetAllMasterShiftAsyn();


            return Json(Response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashCenterList()
        {
            var Response = await _cashcenterService.GetCashCenterAllAsync();


            return Json(Response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashPointList()
        {
            var Response = await _cashpointService.GetCashPointAllAsync();


            return Json(Response);
        }


        [HttpGet]
        public async Task<IActionResult> GetCashCenterByFilter(string institutionId)
        {
            // สร้าง Request Model ตาม Class ที่กำหนด
            var DepartmentId = _appShare.DepartmentId;
            var searchRequest = new CashCenterFilterSearch
            {
                // ถ้าเป็น 'all' ให้ส่งเป็น string.Empty หรือตามที่ Logic Business กำหนด
                institutionFilter = (institutionId == "all") ? string.Empty : institutionId,
                departmentFilter = Convert.ToString(DepartmentId) // สามารถเพิ่ม Logic กรองแผนกได้ในอนาคต
            };

            // เรียก Service ที่รองรับการ Filter (สมมติชื่อ GetByInstitutionAsync)
            var response = await _cashcenterService.GetCashCenterByFilterAsync(searchRequest);

            return Json(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashPointByFilter(string institutionId)
        {
            var DepartmentId = _appShare.DepartmentId;
            var searchRequest = new CashPointFilterSearch
            {
                // ถ้าเป็น 'all' ให้ส่งเป็น string.Empty หรือตามที่ Logic Business กำหนด
                institutionFilter = (institutionId == "all") ? string.Empty : institutionId,
                departmentFilter = Convert.ToString(DepartmentId) // สามารถเพิ่ม Logic กรองแผนกได้ในอนาคต
            };

            var response = await _cashpointService.GetCashPointByFilterAsync(searchRequest);

            return Json(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetZoneList()
        {
            var Response = await _zoneService.GetAllMasterZonesAsync();


            return Json(Response);
        }

        [HttpGet]
        public async Task<IActionResult> CheckSupervisorOnline()
        {
            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            return Json(await _reportService.CheckSupervisorOnlineAsync(new CheckSupervisorOnlineRequest
            {
                DepartmentId = _appShare.DepartmentId
            }));
        }

        #region PreparationUnfit

        [HttpPost]
        public async Task<IActionResult> PreparationUnfit(long[] preparationIds)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(
                    _appShare.RoleCode,
                    _appShare.IsPrepareCentral,
                    _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds == null || preparationIds.Length == 0)
                {
                    throw new ArgumentException("preparationIds is required.");
                }

                PreparationUnfitReportRequest preparationUnfitReportRequest = new PreparationUnfitReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.Unfit
                };

                BaseApiResponse<PreparationUnfitReportModel> preparationUnfitReportModel =
                    await _reportService.PreparationUnfitReportAsync(preparationUnfitReportRequest);

                var builder = new BssBarcodeImageService.BssBarcodeImageServiceBuilder()
                    .SetWidth(BssBarcodeConstants.BarcodeWidth)
                    .SetHeight(BssBarcodeConstants.BarcodeHeight)
                    .SetMargin(BssBarcodeConstants.BarcodeMargin)
                    .SetPureBarcode(true)
                    .SetBarcodeFormat(BarcodeFormat.CODE_128);

                var barcodeImageService = builder.Build(_memoryCache);

                if (preparationUnfitReportModel.data?.ReportDetail?.Count > 0)
                {
                    var tasks = preparationUnfitReportModel.data.ReportDetail.Select(async detail =>
                    {
                        var wrapTask = barcodeImageService.GenerateBarcodeImageAsync(detail.BarcodeWrap);
                        var bundleTask = barcodeImageService.GenerateBarcodeImageAsync(detail.BarcodeBundle);

                        await Task.WhenAll(wrapTask, bundleTask);

                        detail.BarcodeWrapImage = wrapTask.Result;
                        detail.BarcodeBundleImage = bundleTask.Result;
                    });

                    await Task.WhenAll(tasks);
                }

                ViewBag.PreparationIds = preparationIds;

                return View(
                    "~/Views/Preparation/PreparationUnfit/PreparationUnfitPrint.cshtml",
                    preparationUnfitReportModel.data);
            }
            catch
            {
                ViewBag.PreparationIds = preparationIds;
                return View("~/Views/Preparation/PreparationUnfit/PreparationUnfitPrint.cshtml");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PreparationUnfitExportToExcel(long[] preparationIds)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds.Length <= 0)
                {
                    return BadRequest("preparationIds is required.");
                }

                PreparationUnfitReportRequest preparationUnfitReportRequest = new PreparationUnfitReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.Unfit
                };

                BaseApiResponse<PreparationUnfitReportModel> preparationUnfitReportModel = await _reportService.PreparationUnfitReportAsync(preparationUnfitReportRequest);

                BssExcelExportService bssExcelExportService = new BssExcelExportService();
                var workbook = bssExcelExportService.ExportPreparationUnfitToWorkbook(preparationUnfitReportModel.data);

                if (workbook != null)
                {
                    // Todo ส่งไฟล์ออก
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"{BssExcelTemplateNameConstants.PreparationUnfitTemplate}.xlsx"
                    );
                }

                return Json(string.Empty);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        #endregion PreparationUnfit

        #region PreparationUnsortCAMember

        [HttpPost]
        public async Task<IActionResult> PreparationUnsortCAMember(long[] preparationIds)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds.Length <= 0)
                {
                    throw new ArgumentException("preparationIds is required.");
                }

                PreparationUnsortCAMemberReportRequest preparationUnsortCAMemberReportRequest = new PreparationUnsortCAMemberReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.UnsortCAMember
                };

                BaseApiResponse<PreparationUnsortCAMemberReportModel> preparationUnsortCAMemberReportModel = await _reportService.PreparationUnsortCAMemberReportAsync(preparationUnsortCAMemberReportRequest);
                ViewBag.PreparationIds = preparationIds;
                return View("~/Views/Preparation/PreparationUnsortCAMember/PreparationUnsortCAMemberPrint.cshtml", preparationUnsortCAMemberReportModel.data);
            }
            catch (Exception)
            {
                ViewBag.PreparationIds = preparationIds;
                return View("~/Views/Preparation/PreparationUnsortCAMember/PreparationUnsortCAMemberPrint.cshtml");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PreparationUnsortCAMemberExportToExcel(long[] preparationIds)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds.Length <= 0)
                {
                    throw new ArgumentException("preparationIds is required.");
                }

                PreparationUnsortCAMemberReportRequest preparationUnsortCAMemberReportRequest = new PreparationUnsortCAMemberReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.UnsortCAMember
                };

                BaseApiResponse<PreparationUnsortCAMemberReportModel> preparationUnsortCAMemberReportModel = await _reportService.PreparationUnsortCAMemberReportAsync(preparationUnsortCAMemberReportRequest);
                BssExcelExportService bssExcelExportService = new BssExcelExportService(BssExcelTemplateNameConstants.PreparationUnsortCAMemberTemplate);
                var workbook = bssExcelExportService.ExportPreparationUnsortCAMemberToWorkbook(preparationUnsortCAMemberReportModel.data);

                if (workbook != null)
                {
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);

                    // สำคัญ: ต้อง Reset stream position ก่อนอ่าน หรือใช้ ToArray()
                    byte[] content = stream.ToArray();

                    // คืนค่า Memory ของ workbook ทันทีเพื่อลดปัญหาไฟล์ Lock หรือ Corrupt
                    workbook.Dispose();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"{BssExcelTemplateNameConstants.PreparationUnsortCAMemberTemplate}.xlsx"
                    );
                }

                return Json(string.Empty);

            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion PreparationUnsortCAMember

        #region PreparationUnsortCANonMember

        [HttpPost]
        public async Task<IActionResult> PreparationUnsortCANonMember(long[] preparationIds)
        {
            try
            {
                // เช็คสิทธิ์
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                // เช็คจำนวนข้อมูล
                if (preparationIds == null || preparationIds.Length <= 0)
                {
                    // ถ้าส่งมาเยอะมากจนเกิน Limit ของ Server ค่าอาจจะเป็น null หรือว่าง
                    return Content("ไม่พบข้อมูลสำหรับการพิมพ์ หรือข้อมูลมีจำนวนมากเกินขีดจำกัดของระบบ");
                }

                PreparationUnsortCANonMemberReportRequest preparationUnsortCANonMemberReportRequest = new PreparationUnsortCANonMemberReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.UnsortCANonMember
                };

                var preparationUnsortCANonMemberReportModel = await _reportService.PreparationUnsortCANonMemberReportAsync(preparationUnsortCANonMemberReportRequest);

                ViewBag.PreparationIds = preparationIds;
                return View("~/Views/Preparation/PreparationUnsortCANonMember/PreparationCaNonMemberPrint.cshtml", preparationUnsortCANonMemberReportModel.data);
            }
            catch (Exception ex)
            {
                ViewBag.PreparationIds = preparationIds;
                // แนะนำให้ Log error ไว้ด้วยครับ เผื่อกรณีข้อมูลเยอะเกินไปจน Query ช้า
                return View("~/Views/Preparation/PreparationUnsortCANonMember/PreparationCaNonMemberPrint.cshtml");
            }
        }
        [HttpPost]
        public async Task<IActionResult> PreparationUnsortCANonMemberExportToExcel(long[] preparationIds)
        {
            try
            {
                // 1. ตรวจสอบสิทธิ์
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds == null || preparationIds.Length <= 0)
                {
                    return BadRequest("กรุณาเลือกข้อมูลที่ต้องการ Export");
                }

                // 2. ดึงข้อมูลจากฐานข้อมูล
                PreparationUnsortCANonMemberReportRequest request = new PreparationUnsortCANonMemberReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.UnsortCANonMember
                };

                var response = await _reportService.PreparationUnsortCANonMemberReportAsync(request);

                // 3. สร้าง Excel (ใช้ Empty Constructor เพื่อสร้างไฟล์ใหม่ใน Memory)
                BssExcelExportService bssExcelExportService = new BssExcelExportService();
                var workbook = bssExcelExportService.ExportPreparationUnsortCANonMemberToWorkbook(response.data);

                if (workbook != null)
                {
                    var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Seek(0, SeekOrigin.Begin); // กลับไปจุดเริ่มต้นของ Stream

                    // กำหนดชื่อไฟล์ให้สื่อความหมาย
                    string fileName = $"PreparationUnsortCANonMember_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

                    // ส่งไฟล์ออกโดยใช้ Stream ตรงๆ (ช่วยเรื่อง Performance เมื่อข้อมูลเยอะ)
                    return File(
                        stream,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }

                return NotFound("ไม่สามารถสร้างไฟล์ Excel ได้");
            }
            catch (Exception ex)
            {
                // แนะนำให้ Log ข้อมูล error ไว้ที่นี่
                return StatusCode(500, "เกิดข้อผิดพลาดภายในระบบในการ Export ข้อมูล");
            }
        }

        #endregion PreparationUnsortCANonMember

        #region PreparationUnsortCC

        [HttpPost]
        public async Task<IActionResult> PreparationUnsortCC(long[] preparationIds)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds.Length <= 0)
                {
                    throw new ArgumentException("preparationIds is required.");
                }

                PreparationUnsortCCReportRequest preparationUnsortCCReportRequest = new PreparationUnsortCCReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.UnsortCC
                };

                BaseApiResponse<PreparationUnsortCCReportModel> preparationUnsortCCReportModel = await _reportService.PreparationUnsortCCReportAsync(preparationUnsortCCReportRequest);
                ViewBag.PreparationIds = preparationIds;
                return View("~/Views/Preparation/PreparationUnsoftCC/PreparationUnsoftCCPrint.cshtml", preparationUnsortCCReportModel.data);
            }
            catch (Exception)
            {
                ViewBag.PreparationIds = preparationIds;
                return View("~/Views/Preparation/PreparationUnsoftCC/PreparationUnsoftCCPrint.cshtml");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PreparationUnsortCCExportToExcel(long[] preparationIds)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (preparationIds.Length <= 0)
                {
                    throw new ArgumentException("preparationIds is required.");
                }

                PreparationUnsortCCReportRequest preparationUnsortCCReportRequest = new PreparationUnsortCCReportRequest
                {
                    MachineId = _appShare.MachineId,
                    DepartmentId = _appShare.DepartmentId,
                    PreparationIds = preparationIds,
                    BssBnTypeCode = BssBNTypeCodeConstants.UnsortCC
                };

                BaseApiResponse<PreparationUnsortCCReportModel> preparationUnsortCCReportModel = await _reportService.PreparationUnsortCCReportAsync(preparationUnsortCCReportRequest);
                BssExcelExportService bssExcelExportService = new BssExcelExportService(BssExcelTemplateNameConstants.PreparationUnsortCCTemplate);
                var workbook = bssExcelExportService.ExportPreparationUnsortCCToWorkbook(preparationUnsortCCReportModel.data);

                if (workbook != null)
                {
                    // Todo ส่งไฟล์ออก
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"{BssExcelTemplateNameConstants.PreparationUnsortCCTemplate}.xlsx"
                    );
                }

                return Json(string.Empty);

            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion PreparationUnsortCC

        #region RegisterUnsortCC

        [HttpGet]
        public async Task<IActionResult> RegisterUnsortCC([FromQuery] long registerUnsortId)
        {

            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (registerUnsortId <= 0)
                {
                    throw new ArgumentException("register unsort id is required.");
                }

                RegisterUnsortReportRequest registerUnsortReportRequest = new RegisterUnsortReportRequest
                {
                    RegisterUnsortId = registerUnsortId,
                    DepartmentId = _appShare.DepartmentId
                };

                BaseApiResponse<RegisterUnsortReportModel> registerUnsortReport = await _reportService.RegisterUnsortCCReportAsync(registerUnsortReportRequest);
                ViewBag.Ids = new long[] { registerUnsortId };
                return View("~/Views/PrePreparationUnsort/RegisterUnsort/PrintRegisterUnsort.cshtml", registerUnsortReport.data);
            }
            catch (Exception)
            {

                return View("~/Views/PrePreparationUnsort/RegisterUnsort/PrintRegisterUnsort.cshtml");
            }
        }

        [HttpPost]
        // 1. นำ [FromQuery] ออก และเปลี่ยนชื่อพารามิเตอร์ให้ตรงกับ JS (Ids)
        // 2. รับเป็น long[] เพื่อรองรับการส่งค่าจาก Form.submit()
        public async Task<IActionResult> RegisterUnsortCCExportToExcel(long[] Ids)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                // ดึง ID ตัวแรกจาก Array ที่ส่งมา
                long registerUnsortId = (Ids != null && Ids.Length > 0) ? Ids[0] : 0;

                if (registerUnsortId <= 0)
                {
                    // แนะนำให้ return Content แทนการ throw เพื่อไม่ให้ขึ้นหน้าจอ Error สีขาว
                    return Content("ไม่พบรหัสลงทะเบียนสำหรับการ Export Excel");
                }

                RegisterUnsortReportRequest registerUnsortReportRequest = new RegisterUnsortReportRequest
                {
                    RegisterUnsortId = registerUnsortId,
                    DepartmentId = _appShare.DepartmentId
                };

                BaseApiResponse<RegisterUnsortReportModel> registerUnsortReport = await _reportService.RegisterUnsortCCReportAsync(registerUnsortReportRequest);

                // ตรวจสอบข้อมูลก่อนส่งเข้า Excel Service
                if (registerUnsortReport?.data == null)
                {
                    return Content("ไม่พบข้อมูลสำหรับการส่งออก");
                }

                BssExcelExportService bssExcelExportService = new BssExcelExportService(BssExcelTemplateNameConstants.RegisterUnsortTemplate);
                var workbook = bssExcelExportService.ExportRegisterUnsortToWorkbook(registerUnsortReport.data);

                if (workbook != null)
                {
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray(); // ดึงข้อมูลออกมาเป็น Array ก่อนที่ Stream จะปิด

                        string fileName = $"{BssExcelTemplateNameConstants.RegisterUnsortTemplate}_{DateTime.Now:yyyyMMddHHmm}.xlsx";

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            fileName
                        );
                    }
                }

                return Json(string.Empty);
            }
            catch (Exception ex)
            {
                // บันทึก log หรือส่ง error message กลับ
                return Content("เกิดข้อผิดพลาดภายในระบบ: " + ex.Message);
            }
        }

        #endregion RegisterUnsortCC

        #region SendUnsortDelivery

        [HttpGet]
        public async Task<IActionResult> SendUnsortDelivery([FromQuery] long printId, bool isHistory)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (printId <= 0)
                {
                    throw new ArgumentException("print id is required.");
                }

                SendUnsortDeliveryRequest sendUnsortDeliveryRequest = new SendUnsortDeliveryRequest
                {
                    PrintId = printId,
                    IsHistory = isHistory,
                    DepartmentId = _appShare.DepartmentId,
                };

                BaseApiResponse<SendUnsortDeliveryReportModel> sendUnsortDeliveryReportModel = await _reportService.SendUnsortDeliveryReportAsync(sendUnsortDeliveryRequest);
                ViewBag.Ids = new long[] { printId };
                return View("~/Views/PrePreparationUnsort/RegisterUnsortDeliver/SendUnsortDeliveryPrint.cshtml", sendUnsortDeliveryReportModel.data);
            }
            catch (Exception)
            {

                return View("~/Views/PrePreparationUnsort/RegisterUnsortDeliver/SendUnsortDeliveryPrint.cshtml");
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendUnsortDeliveryExportToExcel(long[] Ids, bool isHistory)
        {
            try
            {
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                if (Ids == null || Ids.Length == 0)
                {
                    return Content("print id is required.");
                }

                long printId = Ids[0];

                SendUnsortDeliveryRequest sendUnsortDeliveryRequest = new SendUnsortDeliveryRequest
                {
                    PrintId = printId,
                    IsHistory = isHistory,
                    DepartmentId = _appShare.DepartmentId,
                };

                BaseApiResponse<SendUnsortDeliveryReportModel> sendUnsortDeliveryReportModel = await _reportService.SendUnsortDeliveryReportAsync(sendUnsortDeliveryRequest);
                BssExcelExportService bssExcelExportService = new BssExcelExportService(BssExcelTemplateNameConstants.SendUnsortDeliveryTemplate);
                var workbook = bssExcelExportService.ExportSendUnsortDeliveryToWorkbook(sendUnsortDeliveryReportModel.data);

                if (workbook != null)
                {
                    // Todo ส่งไฟล์ออก
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"{BssExcelTemplateNameConstants.SendUnsortDeliveryTemplate}.xlsx"
                    );


                }

                return Json(string.Empty);
            }
            catch (Exception)
            {

                return View("~/Views/PrePreparationUnsort/RegisterUnsortDeliver/SendUnsortDeliveryPrint.cshtml");
            }
        }

        #endregion SendUnsortDelivery


        #region ReportViewer

        public async Task WarmupAsync()
        {
            var browser = await GetBrowserAsync();

            await using var context = await browser.NewContextAsync();
            var page = await context.NewPageAsync();

            await page.SetContentAsync("<html><body>Warmup</body></html>");
            await page.PdfAsync();

            await page.CloseAsync();
        }

        private async Task<IBrowser> GetBrowserAsync()
        {
            if (_browser != null && _browser.IsConnected)
                return _browser;

            await _lock.WaitAsync();
            try
            {
                if (_browser == null || !_browser.IsConnected)
                {
                    _playwright ??= await Playwright.CreateAsync();

                    _browser = await _playwright.Chromium.LaunchAsync(
                        new BrowserTypeLaunchOptions
                        {
                            Headless = true,
                            Args = new[]
                            {
                        "--no-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu"
                            }
                        });

                    _browser.Disconnected += (_, _) =>
                    {
                        _browser = null;
                    };
                }

                return _browser;
            }
            finally
            {
                _lock.Release();
            }
        }

        private async Task<byte[]> GenerateHtmlToPdfInternalAsync(string htmlContent, string baseUrl)
        {
            await _pdfSemaphore.WaitAsync();

            IBrowserContext? context = null;
            IPage? page = null;

            try
            {
                var browser = await GetBrowserAsync();

                context = await browser.NewContextAsync();

                page = await context.NewPageAsync();

                if (!htmlContent.Contains("<base"))
                {
                    htmlContent = htmlContent.Replace(
                        "<head>",
                        $"<head><base href=\"{baseUrl}/\">"
                    );
                }

                await page.SetContentAsync(htmlContent, new PageSetContentOptions
                {
                    WaitUntil = WaitUntilState.DOMContentLoaded,
                    Timeout = 60000
                });

                await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

                await page.EvaluateAsync("() => document.fonts.ready");

                var pdfBytes = await page.PdfAsync(new PagePdfOptions
                {
                    Format = "A4",
                    PrintBackground = true,
                    Margin = new Margin
                    {
                        Top = "1cm",
                        Bottom = "1cm",
                        Left = "1cm",
                        Right = "1cm"
                    }
                });

                Interlocked.Increment(ref _pdfCounter);

                if (_pdfCounter >= BrowserRecycleThreshold)
                {
                    await RecycleBrowserAsync();
                }

                return pdfBytes;
            }
            catch (PlaywrightException)
            {
                await SafeResetBrowserAsync();
                throw;
            }
            finally
            {
                if (page != null)
                    await page.CloseAsync();

                if (context != null)
                    await context.CloseAsync();

                _pdfSemaphore.Release();
            }
        }

        private async Task RecycleBrowserAsync()
        {
            await _lock.WaitAsync();
            try
            {
                if (_browser != null)
                {
                    await _browser.CloseAsync();
                    _browser = null;
                }

                _pdfCounter = 0;
            }
            finally
            {
                _lock.Release();
            }
        }

        private async Task SafeResetBrowserAsync()
        {
            await _lock.WaitAsync();
            try
            {
                if (_browser != null)
                {
                    await _browser.CloseAsync();
                    _browser = null;
                }
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<IActionResult> ExportPdf([FromBody] ReportModel request)
        {
            if (string.IsNullOrEmpty(request.DataBody))
                return BadRequest();

            string safeFileName = string.IsNullOrEmpty(request.FileName)
                ? "Export_Report"
                : request.FileName;

            var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            try
            {
                var pdfBytes = await GenerateHtmlToPdfInternalAsync(request.DataBody, baseUrl);

                return File(pdfBytes, "application/pdf", $"{safeFileName}.pdf");
            }
            catch
            {
                return StatusCode(500, "PDF generation failed.");
            }
        }

        #endregion

        #region Report BankSummary 

        [HttpPost]
        public async Task<IActionResult> GetReportBankSummary([FromBody] reportBankSummaryRequest request)
        {
            // 2. ควรตรวจสอบ Model State หากจำเป็น
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // เรียกใช้ Service
                var response = await _reportService.BankSummaryReportAsync(request);

                // 3. ส่งข้อมูลกลับ
                return Json(response);
            }
            catch (Exception ex)
            {
                // 4. จัดการ Error เบื้องต้น
                // ควรทำ Logging ที่นี่
                return StatusCode(500, new { is_success = false, message = "Internal Server Error" });
            }
        }


        [HttpPost]
        public async Task<IActionResult> BankSummaryExportToExcel([FromBody] reportBankSummaryRequest request)
        {
            try
            {
                // 1. ตรวจสอบสิทธิ์การใช้งาน
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                // 2. ตรวจสอบ Model State
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // 3. เรียกดึงข้อมูลจาก Service (ใช้ request ชุดเดียวกับหน้าจอ)
                // ผลลัพธ์ที่ได้จะเป็น BaseApiResponse<reportBankSummaryResponse>
                var response = await _reportService.BankSummaryReportAsync(request);

                // ตรวจสอบ is_success และข้อมูล data ภายใน BaseApiResponse
                if (response == null || !response.is_success || response.data == null)
                {
                    return BadRequest(response?.msg_desc ?? "ไม่พบข้อมูลสำหรับส่งออก Excel");
                }

                // 4. สร้าง Excel Workbook จากข้อมูล response.data
                BssExcelExportService bssExcelExportService = new BssExcelExportService();
                var workbook = bssExcelExportService.ExportBankSummaryToWorkbook(response.data);

                if (workbook != null)
                {
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    // ตั้งชื่อไฟล์ตามชื่อรายงานและวันที่
                    string fileName = $"BankSummaryReport_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }

                return Json(string.Empty);
            }
            catch (Exception ex)
            {
                // แนะนำให้ทำการ Log ex ไว้ที่นี่
                return StatusCode(500, new { is_success = false, message = ex.Message });
            }
        }

        #endregion

        #region Report CashPointCenter 

        [HttpPost]
        public async Task<IActionResult> GetReportCashPointCenter([FromBody] reportCashPointCenterRequest request)
        {
            // 2. ควรตรวจสอบ Model State หากจำเป็น
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // เรียกใช้ Service
                //var response = Json("");
                var response = await _reportService.CashPointCenterReportAsync(request);

                // 3. ส่งข้อมูลกลับ
                return Json(response);
            }
            catch (Exception ex)
            {
                // 4. จัดการ Error เบื้องต้น
                // ควรทำ Logging ที่นี่
                return StatusCode(500, new { is_success = false, message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CashPointCashCenterExportToExcel([FromBody] reportCashPointCenterRequest request)
        {
            try
            {
                // 1. ตรวจสอบสิทธิ์การใช้งาน
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                // 2. ตรวจสอบ Model State
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // 3. เรียกดึงข้อมูลจาก Service (ใช้ request ชุดเดียวกับหน้าจอ)
                // ผลลัพธ์ที่ได้จะเป็น BaseApiResponse<reportBankSummaryResponse>
                var response = await _reportService.CashPointCenterReportAsync(request);

                // ตรวจสอบ is_success และข้อมูล data ภายใน BaseApiResponse
                if (response == null || !response.is_success || response.data == null)
                {
                    return BadRequest(response?.msg_desc ?? "ไม่พบข้อมูลสำหรับส่งออก Excel");
                }

                // 4. สร้าง Excel Workbook จากข้อมูล response.data
                BssExcelExportService bssExcelExportService = new BssExcelExportService();
                var workbook = bssExcelExportService.ExportCashPointCenterToWorkbook(response.data);

                if (workbook != null)
                {
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    // ตั้งชื่อไฟล์ตามชื่อรายงานและวันที่
                    string fileName = $"CashPointCashCenter_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }

                return Json(string.Empty);
            }
            catch (Exception ex)
            {
                // แนะนำให้ทำการ Log ex ไว้ที่นี่
                return StatusCode(500, new { is_success = false, message = ex.Message });
            }
        }


        #endregion

        #region Report SingleHeaderCard

        [HttpGet]
        public async Task<IActionResult> GetHeaderCardList([FromQuery] HeaderCardListRequest request)
        {
            // ตรวจสอบเบื้องต้น
            if (string.IsNullOrEmpty(request.MachineId) || request.Date == default)
            {
                return Json(new { is_success = false, message = "ข้อมูล Machine หรือวันที่ไม่ถูกต้อง" });
            }

            var DepartmentId = _appShare.DepartmentId;
            var RoleGroupCode = _appShare.RoleGroupCode;

            request.DepartmentId = DepartmentId;
            request.RoleGroupCode = RoleGroupCode;

            // เรียก Service ที่ดึงข้อมูล Header Card ตามเงื่อนไข
            // สมมติว่าชื่อ _reportService หรือ _headerCardService
            var response = await _reportService.GetHeaderCardListAsync(request);

            return Json(response);
        }

        [HttpPost]
        public async Task<IActionResult> GetReportSingleHeaderCard([FromBody] reportSingleHeaderCardRequest request)
        {


            try
            {
                var DepartmentId = _appShare.DepartmentId;
                var RoleGroupCode = _appShare.RoleGroupCode;
                var RequestByUserId = _appShare.UserID;

                request.DepartmentId = DepartmentId;
                request.RoleGroupCode = RoleGroupCode;
                request.RequestByUserId = RequestByUserId;


                // เรียกใช้ Service
                //var response = Json("");
                var response = await _reportService.SingleHeaderCardReportAsync(request);


                var builder = new BssBarcodeImageService.BssBarcodeImageServiceBuilder()
                    .SetWidth(BssBarcodeConstants.BarcodeWidth)
                    .SetHeight(BssBarcodeConstants.BarcodeHeight)
                    .SetMargin(BssBarcodeConstants.BarcodeMargin)
                    .SetPureBarcode(true)
                    .SetBarcodeFormat(BarcodeFormat.CODE_128);

                var barcodeImageService = builder.Build(_memoryCache);

                var wrapTask = barcodeImageService.GenerateBarcodeImageAsync(response.data.PackBarcode);
                var bundleTask = barcodeImageService.GenerateBarcodeImageAsync(response.data.BundleBarcode);

                response.data.PackBarcodeImage = await wrapTask;
                response.data.BundleBarcodeImage = await bundleTask;




                // 3. ส่งข้อมูลกลับ
                return Json(response);
            }
            catch (Exception ex)
            {
                // 4. จัดการ Error เบื้องต้น
                // ควรทำ Logging ที่นี่
                return StatusCode(500, new { is_success = false, message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SingleHeaderCardExportToExcel([FromBody] reportCashPointCenterRequest request)
        {
            try
            {
                // 1. ตรวจสอบสิทธิ์การใช้งาน
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                // 2. ตรวจสอบ Model State
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // 3. เรียกดึงข้อมูลจาก Service (ใช้ request ชุดเดียวกับหน้าจอ)
                // ผลลัพธ์ที่ได้จะเป็น BaseApiResponse<reportBankSummaryResponse>
                var response = await _reportService.CashPointCenterReportAsync(request);

                // ตรวจสอบ is_success และข้อมูล data ภายใน BaseApiResponse
                if (response == null || !response.is_success || response.data == null)
                {
                    return BadRequest(response?.msg_desc ?? "ไม่พบข้อมูลสำหรับส่งออก Excel");
                }

                // 4. สร้าง Excel Workbook จากข้อมูล response.data
                BssExcelExportService bssExcelExportService = new BssExcelExportService();
                var workbook = bssExcelExportService.ExportCashPointCenterToWorkbook(response.data);

                if (workbook != null)
                {
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    // ตั้งชื่อไฟล์ตามชื่อรายงานและวันที่
                    string fileName = $"CashPointCashCenter_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }

                return Json(string.Empty);
            }
            catch (Exception ex)
            {
                // แนะนำให้ทำการ Log ex ไว้ที่นี่
                return StatusCode(500, new { is_success = false, message = ex.Message });
            }
        }

        #endregion

        #region Report MultiHeaderCard

        [HttpPost]
        public async Task<IActionResult> GetReportMultiHeaderCard([FromBody] reportMultiHeaderCardRequest request)
        {


            try
            {
                var DepartmentId = _appShare.DepartmentId;
                var RoleGroupCode = _appShare.RoleGroupCode;
                var RequestByUserId = _appShare.UserID;

                request.DepartmentId = DepartmentId;
                request.RoleGroupCode = RoleGroupCode;
                request.RequestByUserId = RequestByUserId;


                // เรียกใช้ Service
                //var response = Json("");
                var response = await _reportService.MultiHeaderCardReportAsync(request);


                

                // 3. ส่งข้อมูลกลับ
                return Json(response);
            }
            catch (Exception ex)
            {
                // 4. จัดการ Error เบื้องต้น
                // ควรทำ Logging ที่นี่
                return StatusCode(500, new { is_success = false, message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> MultiHeaderCardExportToExcel([FromBody] reportCashPointCenterRequest request)
        {
            try
            {
                // 1. ตรวจสอบสิทธิ์การใช้งาน
                if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
                {
                    return RedirectToUnauthorizedPage();
                }

                // 2. ตรวจสอบ Model State
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // 3. เรียกดึงข้อมูลจาก Service (ใช้ request ชุดเดียวกับหน้าจอ)
                // ผลลัพธ์ที่ได้จะเป็น BaseApiResponse<reportBankSummaryResponse>
                var response = await _reportService.CashPointCenterReportAsync(request);

                // ตรวจสอบ is_success และข้อมูล data ภายใน BaseApiResponse
                if (response == null || !response.is_success || response.data == null)
                {
                    return BadRequest(response?.msg_desc ?? "ไม่พบข้อมูลสำหรับส่งออก Excel");
                }

                // 4. สร้าง Excel Workbook จากข้อมูล response.data
                BssExcelExportService bssExcelExportService = new BssExcelExportService();
                var workbook = bssExcelExportService.ExportCashPointCenterToWorkbook(response.data);

                if (workbook != null)
                {
                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    // ตั้งชื่อไฟล์ตามชื่อรายงานและวันที่
                    string fileName = $"CashPointCashCenter_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

                    return File(
                        stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName
                    );
                }

                return Json(string.Empty);
            }
            catch (Exception ex)
            {
                // แนะนำให้ทำการ Log ex ไว้ที่นี่
                return StatusCode(500, new { is_success = false, message = ex.Message });
            }
        }


        #endregion
    }
}
