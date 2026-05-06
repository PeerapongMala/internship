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
    public class VerifyController : BaseController
    {
        private readonly ILogger<VerifyController> _logger;
        private readonly IVerifyTransactionService _verifyTransactionService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IAppShare _appShare;

        public VerifyController(
            ILogger<VerifyController> logger,
            IVerifyTransactionService verifyTransactionService,
            IAppShare appShare,
            IMasterMachineService machineService,
            IHttpContextAccessor httpContextAccessor) : base(appShare)
        {
            _logger = logger;
            _verifyTransactionService = verifyTransactionService;
            _appShare = appShare;
            _machineService = machineService;
            _httpContextAccessor = httpContextAccessor;
        }

        #region View Actions

        [AuthenticationActionFilter]
        public IActionResult Index()
        {
            return RedirectToAction("VerifyAutoSelling");
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> VerifyAutoSelling()
        {
            // Validate operation permissions (role + machine)
            if (!AppValidationHelper.ValidatOperationForVerify(_appShare.RoleCode, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Verify.VerifyAutoSelling.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.Verifier = $"{_appShare.FirstName} {_appShare.LastName}";
            model.SortingMachine = "-";

            var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
            if (resultMachine.is_success)
            {
                model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
            }

            // Determine variant based on BnType
            var bnType = _appShare.BnType;
            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNSORT CC";
                model.CssVariantClass = "verify-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNSORT CA MEMBER";
                model.CssVariantClass = "verify-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNSORT CA NON-MEMBER";
                model.CssVariantClass = "verify-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                // Unknown BnType → redirect to Unauthorized
                return RedirectToUnauthorizedPage();
            }

            return View("~/Views/Verify/VerifyAutoSelling/Index.cshtml", model);
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> VerifyConfirmation()
        {
            var model = new BSS_WEB.Views.Verify.VerifyConfirmation.IndexModel();
            model.Supervisor = $"{_appShare.FirstName} {_appShare.LastName}";
            model.SortingMachine = "-";

            var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
            if (resultMachine.is_success)
            {
                model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
            }

            // Determine variant based on BnType
            var bnType = _appShare.BnType;
            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.CssVariantClass = "verify-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.CssVariantClass = "verify-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.CssVariantClass = "verify-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/Verify/VerifyConfirmation/Index.cshtml", model);
        }

        //[AuthenticationActionFilter] // DEV: disabled for mock — bypass login
        public IActionResult ManualKeyIn()
        {
            var model = new BSS_WEB.Views.Verify.ManualKeyIn.IndexModel();

            var bnType = _appShare.BnType;
            // DEV: default to UC when no login
            if (string.IsNullOrEmpty(bnType)) bnType = "UC";

            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.BnTypeNameDisplay = "Edit & Manual Key-in UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "Edit & Manual Key-in Unsort CC";
                model.CssVariantClass = "verify-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "Edit & Manual Key-in Unsort CA Member";
                model.CssVariantClass = "verify-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "Edit & Manual Key-in Unsort CA Non-Member";
                model.CssVariantClass = "verify-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.BnTypeNameDisplay = "Edit & Manual Key-in";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/Verify/ManualKeyIn/Index.cshtml", model);
        }

        #endregion View Actions

        #region AJAX Endpoints

        [HttpPost("Verify/GetVerifyTransactionsDetailAsync")]
        public async Task<IActionResult> GetVerifyTransactionsDetailAsync([FromBody] PagedRequest<VerifyTransactionFilterRequest> request)
        {
            request.Filter = new VerifyTransactionFilterRequest
            {
                DepartmentId = _appShare.DepartmentId,
                IsActive = true,
            };

            var serviceResult = await _verifyTransactionService.GetVerifyTransactionsAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ScanHeaderCard([FromBody] VerifyScanRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;
                request.CreatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.ScanHeaderCardAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SCAN_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHeaderCardDetail(long verifyTranId)
        {
            var serviceResult = await _verifyTransactionService.GetHeaderCardDetailAsync(verifyTranId);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> EditVerifyTran([FromBody] EditVerifyTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.EditVerifyTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditVerifyTran failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteVerifyTran([FromBody] DeleteVerifyTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.DeleteVerifyTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteVerifyTran failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVerifyDetail(long id)
        {
            var serviceResult = await _verifyTransactionService.GetVerifyDetailAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> VerifyAction([FromBody] VerifyActionRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.VerifyAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Verify failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "VERIFY_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CancelVerify([FromBody] CancelVerifyRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.CancelVerifyAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelVerify failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CANCEL_VERIFY_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetVerifyCount([FromBody] VerifyCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _verifyTransactionService.GetVerifyCountAsync(request);
            return Json(serviceResult);
        }

        #endregion AJAX Endpoints
    }
}
