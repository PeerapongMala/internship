using BSS_WEB.Infrastructure;
using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
<<<<<<< HEAD
using BSS_WEB.Infrastructure;
=======
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class RevokeController : BaseController
    {
        private readonly ILogger<RevokeController> _logger;
        private readonly IRevokeTransactionService _revokeTransactionService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IAppShare _appShare;

        public RevokeController(
            ILogger<RevokeController> logger,
            IRevokeTransactionService revokeTransactionService,
            IAppShare appShare,
            IMasterMachineService machineService,
            IHttpContextAccessor httpContextAccessor) : base(appShare)
        {
            _logger = logger;
            _revokeTransactionService = revokeTransactionService;
            _appShare = appShare;
            _machineService = machineService;
            _httpContextAccessor = httpContextAccessor;
        }

        #region View Actions

        [AuthenticationActionFilter]
        public IActionResult Index()
        {
            return RedirectToAction("RevokeAutoSelling");
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> RevokeAutoSelling()
        {
            var model = new BSS_WEB.Views.Revoke.RevokeAutoSelling.IndexModel();
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
                model.BnTypeNameDisplay = "Revoke การนับคัดธนบัตรประเภท UNFIT";
                model.CssVariantClass = "revoke-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "Revoke การนับคัดธนบัตรประเภท UNSORT CC";
                model.CssVariantClass = "revoke-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "Revoke การนับคัดธนบัตรประเภท UNSORT CA MEMBER";
                model.CssVariantClass = "revoke-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "Revoke การนับคัดธนบัตรประเภท UNSORT CA NON-MEMBER";
                model.CssVariantClass = "revoke-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.BnTypeNameDisplay = "Revoke การนับคัดธนบัตร";
                model.CssVariantClass = "revoke-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/Revoke/RevokeAutoSelling/Index.cshtml", model);
        }

        #endregion View Actions

        #region AJAX Endpoints

        [HttpPost("Revoke/GetRevokeTransactionsDetailAsync")]
        public async Task<IActionResult> GetRevokeTransactionsDetailAsync([FromBody] PagedRequest<RevokeTransactionFilterRequest> request)
        {
            request.Filter = new RevokeTransactionFilterRequest
            {
                DepartmentId = _appShare.DepartmentId,
<<<<<<< HEAD
                IsActive = true,
            };

            var serviceResult = await _revokeTransactionService.GetRevokeTransactionsAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ScanHeaderCard([FromBody] RevokeScanRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;
                request.CreatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _revokeTransactionService.ScanHeaderCardAsync(request);
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
            var serviceResult = await _revokeTransactionService.GetHeaderCardDetailAsync(verifyTranId);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> EditRevokeTran([FromBody] EditRevokeTranRequest request)
=======
            };

            var serviceResult = await _revokeTransactionService.GetRevokeListAsync(request);
            return Json(serviceResult);
        }

        [HttpGet("Revoke/GetRevokeDetail")]
        public async Task<IActionResult> GetRevokeDetail([FromQuery] string headerCardCode)
        {
            var serviceResult = await _revokeTransactionService.GetDetailAsync(headerCardCode);
            return Json(serviceResult);
        }

        [HttpPost("Revoke/ExecuteRevoke")]
        public async Task<IActionResult> ExecuteRevoke([FromBody] RevokeActionRequest request)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

<<<<<<< HEAD
                var serviceResult = await _revokeTransactionService.EditRevokeTranAsync(request);
=======
                var serviceResult = await _revokeTransactionService.ExecuteRevokeAsync(request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
<<<<<<< HEAD
                _logger.LogError(ex, "EditRevokeTran failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteRevokeTran([FromBody] DeleteRevokeTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _revokeTransactionService.DeleteRevokeTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteRevokeTran failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRevokeDetail(long id)
        {
            var serviceResult = await _revokeTransactionService.GetRevokeDetailAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> RevokeAction([FromBody] RevokeActionRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _revokeTransactionService.RevokeAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Revoke failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "REVOKE_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CancelRevoke([FromBody] CancelRevokeRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _revokeTransactionService.CancelRevokeAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelRevoke failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CANCEL_REVOKE_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetRevokeCount([FromBody] RevokeCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _revokeTransactionService.GetRevokeCountAsync(request);
            return Json(serviceResult);
        }

=======
                _logger.LogError(ex, "ExecuteRevoke failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EXECUTE_REVOKE_FAILED" });
            }
        }

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        #endregion AJAX Endpoints
    }
}
