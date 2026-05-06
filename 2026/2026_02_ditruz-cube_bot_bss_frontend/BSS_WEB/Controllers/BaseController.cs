using BSS_WEB.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class BaseController : Controller
    {
        private readonly IAppShare _share;
        public BaseController(IAppShare share)
        {
            _share = share;
        }
        protected IActionResult RedirectToUnauthorizedPage()
        {
            return new RedirectToRouteResult(new RouteValueDictionary { { "action", "UnauthorizedPage" }, { "controller", "Login" } });
        }
    }
}
