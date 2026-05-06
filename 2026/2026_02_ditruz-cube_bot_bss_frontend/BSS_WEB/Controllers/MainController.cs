using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using BSS_WEB.Infrastructure;
using BSS_WEB.Helpers;
using Microsoft.AspNetCore.Identity;
using System.Net.Http;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction;
using BSS_WEB.Core.Constants;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MainController : BaseController
    {
        private readonly ILogger<MainController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IBssAuthenticationService _bssAuthenService;
        private readonly IMasterConfigService _configService;
        private readonly IMasterShiftService _shiftService;
        private readonly IClaimsUpdaterService _claimsService;
        private readonly IAppShare _appShare;
        private readonly IReceiveCbmsTransactionService _receiveCbmsService;

        public MainController(ILogger<MainController> logger,
            IHttpContextAccessor httpContextAccessor,
            IBssAuthenticationService bssAuthenService,
            IMasterConfigService configService,
            IMasterShiftService shiftService,
            IAppShare appShare,
            IClaimsUpdaterService claimsService,
            IReceiveCbmsTransactionService receiveCbmsService) : base(appShare)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _bssAuthenService = bssAuthenService;
            _configService = configService;
            _shiftService = shiftService;
            _appShare = appShare;
            _claimsService = claimsService;
            _receiveCbmsService = receiveCbmsService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> OperationSetting()
        {
            if (!AppValidationHelper.ValidatForOperationSetting(_appShare.RoleGroupCode))
            {
               return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Main.OperationSettingModel();
            model.IsPrepareCentral = _appShare.IsPrepareCentral;
            model.BssMessage = "";
            return View("~/Views/Main/OperationSetting.cshtml", model);
        }

        public IActionResult VerifySetting()
        {

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SubmitForOperationSetting([FromBody] SaveOperationSettingRequest requestData)
        {
            requestData.userId = _appShare.UserID;

            if (_appShare.IsPrepareCentral == "YES")
            {
                requestData.machineSelected = "999"; // 999 is Prepare Central
            }

            var authenResult = await _bssAuthenService.UpdateUserOperationSettingAsync(requestData);
            if (authenResult.is_success)
            {
                #region  /* Replacing an existing Cookies With HttpOnly Secure */

                Response.SetAuthCookies(CookieNameConstants.OperationSettingId, authenResult?.data?.roleId.ToString() ?? "0");
                Response.SetAuthCookies(CookieNameConstants.OperationSettingCode, authenResult?.data?.roleCode?.ToString() ?? "");
                Response.SetAuthCookies(CookieNameConstants.OperationSettingName, authenResult?.data?.roleName?.ToString() ?? "");

                if (authenResult?.data?.roleCode == AppRoles.OperatorReconcile.GetCategory())
                {
                    Response.SetAuthCookies(CookieNameConstants.MachineSetting, authenResult?.data?.machineId?.ToString() ?? "999");
                    Response.SetAuthCookies(CookieNameConstants.SorterSetting, authenResult?.data?.sorterUserId?.ToString() ?? "999");
                }
                else
                {
                    if (_appShare.IsPrepareCentral != "YES")
                    {
                        Response.SetAuthCookies(CookieNameConstants.MachineSetting, authenResult?.data?.machineId?.ToString() ?? "999");
                    }
                }

                Response.SetAuthCookies(CookieNameConstants.BanknoteTypeSetting, requestData.banknoteTypeSelected ?? "999");
                #endregion  /* Replacing an existing Cookies With HttpOnly Secure */
            }

            return Json(authenResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetSorterUsers()
        {
            var requestData = new GetSorterUsersRequest();
            requestData.requestByUserId = _appShare.UserID;
            requestData.departmentId = _appShare.DepartmentId;

            var sortersResult = await _bssAuthenService.GetSorterUsersAsync(requestData);
            return Json(sortersResult);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitForVerifySetting([FromBody] SaveVerifySettingRequest requestData)
        {
            requestData.userId = _appShare.UserID;
            requestData.operationSelected = _appShare.RoleCode;

            var authenResult = await _bssAuthenService.UpdateUserVerifySettingAsync(requestData);
            if (authenResult.is_success)
            {
                #region  /* Replacing an existing Cookies With HttpOnly Secure */

                Response.SetAuthCookies(CookieNameConstants.OperationSettingId, authenResult?.data?.roleId.ToString() ?? "0");
                Response.SetAuthCookies(CookieNameConstants.OperationSettingCode, authenResult?.data?.roleCode?.ToString() ?? "");
                Response.SetAuthCookies(CookieNameConstants.OperationSettingName, authenResult?.data?.roleName?.ToString() ?? "");
                Response.SetAuthCookies(CookieNameConstants.MachineSetting, authenResult?.data?.machineId?.ToString() ?? "999");

                #endregion  /* Replacing an existing Cookies With HttpOnly Secure */
            }

            return Json(authenResult);
        }
    }
}
