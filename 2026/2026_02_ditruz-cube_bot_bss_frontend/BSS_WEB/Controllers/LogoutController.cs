using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BSS_WEB.Controllers
{
    public class LogoutController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBssAuthenticationService _bssAuthenService;
        private readonly IAppShare _appShare;
        public LogoutController(ILogger<LoginController> logger, IHttpContextAccessor httpContextAccessor, IBssAuthenticationService bssAuthenService, IAppShare appShare)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _bssAuthenService = bssAuthenService;
            _appShare = appShare;
        }


        [AuthenticationActionFilter]
        public async Task<IActionResult> Index()
        {
            var refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.RefreshToken];
            if (refreshToken == null)
                return View();

            var logoutRequest = new LogoutAndRevokeRequest()
            {
                RefreshToken = refreshToken
            };

            var logoutResult = await _bssAuthenService.LogoutAndRevoke(logoutRequest);
            if (logoutResult.is_success == false || logoutResult.data == null)
            {
                return Json(logoutResult);
            }

            if (logoutResult.data.IsRevoked) {

                Response.ClearAuthCookies();
            }

            return View();
        }
    }
}
