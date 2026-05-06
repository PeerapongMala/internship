using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class HoldingController : BaseController
    {
        private readonly IAppShare _appShare;
        private readonly IHoldingDetailService _holdingDetailService;
        private readonly ILogger<HoldingController> _logger;

        public HoldingController(
            IAppShare appShare,
            IHoldingDetailService holdingDetailService,
            ILogger<HoldingController> logger) : base(appShare)
        {
            _appShare = appShare;
            _holdingDetailService = holdingDetailService;
            _logger = logger;
        }

        [AuthenticationActionFilter]
        public IActionResult Detail(int? id)
        {
            ViewData["PageVersion"] = id ?? 0;

            var bnType = _appShare.BnType;
            if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                ViewData["BnTypeName"] = "UNSORT CC";
                ViewData["CssVariant"] = "holding-unsort-cc";
                ViewData["BnTypeCode"] = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                ViewData["BnTypeName"] = "UNSORT CA MEMBER";
                ViewData["CssVariant"] = "holding-ca-member";
                ViewData["BnTypeCode"] = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                ViewData["BnTypeName"] = "UNSORT CA NON-MEMBER";
                ViewData["CssVariant"] = "holding-ca-non-member";
                ViewData["BnTypeCode"] = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                ViewData["BnTypeName"] = "UNFIT";
                ViewData["CssVariant"] = "holding-unfit";
                ViewData["BnTypeCode"] = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/holding/unfit/Index.cshtml");
        }

        #region AJAX Endpoints

        [HttpGet]
        public async Task<IActionResult> GetHoldingDetailData(string bnType)
        {
            try
            {
                var result = await _holdingDetailService.GetHoldingDetailAsync(bnType, _appShare.DepartmentId);
                if (result?.is_success == true && result.data != null)
                {
                    // Enrich page info from session context
                    result.data.PageInfo.Supervisor = _appShare.UserNameDisplay ?? "-";
                    result.data.PageInfo.Machine = _appShare.DepartmentShortName ?? "-";
                    result.data.PageInfo.Shift = string.IsNullOrEmpty(result.data.PageInfo.Shift) || result.data.PageInfo.Shift == "-"
                        ? (_appShare.ShiftName ?? "-")
                        : result.data.PageInfo.Shift;
                }
                return Json(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetHoldingDetailData failed");
                return Json(new { is_success = false, msg_desc = "LOAD_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHoldingDetailByHc(string headerCards, string bnType)
        {
            try
            {
                var result = await _holdingDetailService.GetHoldingDetailByHcAsync(headerCards, bnType);
                return Json(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetHoldingDetailByHc failed");
                return Json(new { is_success = false, msg_desc = "LOAD_FAILED" });
            }
        }

        #endregion AJAX Endpoints
    }
}
