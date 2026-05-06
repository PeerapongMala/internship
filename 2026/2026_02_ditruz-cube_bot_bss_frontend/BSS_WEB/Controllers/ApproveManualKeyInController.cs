using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class ApproveManualKeyInController : BaseController
    {
        private readonly ILogger<ApproveManualKeyInController> _logger;
        private readonly IApproveManualKeyInTransactionService _approveManualKeyInTransactionService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IAppShare _appShare;

        public ApproveManualKeyInController(
            ILogger<ApproveManualKeyInController> logger,
            IApproveManualKeyInTransactionService approveManualKeyInTransactionService,
            IAppShare appShare,
            IMasterMachineService machineService,
            IHttpContextAccessor httpContextAccessor) : base(appShare)
        {
            _logger = logger;
            _approveManualKeyInTransactionService = approveManualKeyInTransactionService;
            _appShare = appShare;
            _machineService = machineService;
            _httpContextAccessor = httpContextAccessor;
        }

        #region View Actions

        // ===== TESTING MODE: Bypass authentication =====
        // TEMPORARY: Comment out filter for mock data testing without login
        // TODO: Uncomment when testing with real authentication
        // [AuthenticationActionFilter]
        public IActionResult Index()
        {
            return RedirectToAction("ApproveManualKeyInPage");
        }

        // [AuthenticationActionFilter]
        public async Task<IActionResult> ApproveManualKeyInPage()
        {
            var model = new BSS_WEB.Views.ApproveManualKeyIn.ApproveManualKeyInPage.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.Approver = $"{_appShare.FirstName} {_appShare.LastName}";
            model.SortingMachine = "-";

            var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
            if (resultMachine.is_success)
            {
                model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
            }

            // Blue theme for Approve Manual Key-in (consistent with Verify domain)
            model.PageTitle = "Approve Manual Key-in";
            model.PageTitleThai = "อนุมัติการกรอกข้อมูลด้วยตนเอง";
            model.CssVariantClass = "approve-manual-key-in";
            ViewData["NavColorClass"] = "nav-blue";

            return View("~/Views/ApproveManualKeyIn/ApproveManualKeyInPage/Index.cshtml", model);
        }

        #endregion View Actions

        #region AJAX Endpoints

        [HttpPost("ApproveManualKeyIn/GetApproveManualKeyInTransactionsDetailAsync")]
        public async Task<IActionResult> GetApproveManualKeyInTransactionsDetailAsync([FromBody] PagedRequest<ApproveManualKeyInTransactionFilterRequest> request)
        {
            request.Filter = new ApproveManualKeyInTransactionFilterRequest
            {
                DepartmentId = _appShare.DepartmentId,
                IsActive = true,
            };

            var serviceResult = await _approveManualKeyInTransactionService.GetApproveManualKeyInTransactionsAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ScanHeaderCard([FromBody] ApproveManualKeyInScanRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;
                request.CreatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.ScanHeaderCardAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SCAN_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHeaderCardDetail(long approveManualKeyInTranId)
        {
            var serviceResult = await _approveManualKeyInTransactionService.GetHeaderCardDetailAsync(approveManualKeyInTranId);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> EditApproveManualKeyInTran([FromBody] EditApproveManualKeyInTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.EditApproveManualKeyInTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditApproveManualKeyInTran failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteApproveManualKeyInTran([FromBody] DeleteApproveManualKeyInTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.DeleteApproveManualKeyInTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteApproveManualKeyInTran failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetApproveManualKeyInDetail(long id)
        {
            var serviceResult = await _approveManualKeyInTransactionService.GetApproveManualKeyInDetailAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> Approve([FromBody] ApproveManualKeyInActionRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.ApproveAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Approve failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "APPROVE_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Deny([FromBody] CancelApproveManualKeyInRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.DenyAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Deny failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DENY_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetApproveManualKeyInCount([FromBody] ApproveManualKeyInCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _approveManualKeyInTransactionService.GetApproveManualKeyInCountAsync(request);
            return Json(serviceResult);
        }

        #endregion AJAX Endpoints
    }
}
