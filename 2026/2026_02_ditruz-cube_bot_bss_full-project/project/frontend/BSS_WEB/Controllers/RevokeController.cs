using BSS_WEB.Infrastructure;
using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
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
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _revokeTransactionService.ExecuteRevokeAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ExecuteRevoke failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EXECUTE_REVOKE_FAILED" });
            }
        }

        #endregion AJAX Endpoints
    }
}
