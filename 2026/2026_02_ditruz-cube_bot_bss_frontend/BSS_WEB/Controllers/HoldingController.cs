using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class HoldingController : BaseController
    {
        private readonly IAppShare _appShare;

        public HoldingController(IAppShare appShare) : base(appShare)
        {
            _appShare = appShare;
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
    }
}
