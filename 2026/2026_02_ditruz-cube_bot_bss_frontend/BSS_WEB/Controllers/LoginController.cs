using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BSS_WEB.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using BSS_WEB.Helpers;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Interfaces;
using System.Security.Cryptography.X509Certificates;
using System.Security.Principal;
using Microsoft.AspNetCore.Authentication;
using System.Net.Mime;
using System.Security.Claims;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Authentication.Cookies;
using DocumentFormat.OpenXml.InkML;
using Microsoft.Playwright;
using BSS_WEB.Core.Constants;
using BSS_WEB.Views.Main;
using Microsoft.EntityFrameworkCore;
using ZXing;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Services;

namespace BSS_WEB.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;
        private readonly IBssAuthenticationService _bssAuthenService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAppShare _appShare;
        public LoginController(
            ILogger<LoginController> logger,
            IBssAuthenticationService bssAuthenService,
            IHttpContextAccessor httpContextAccessor,
            IAppShare appShare)
        {
            _logger = logger;
            _bssAuthenService = bssAuthenService;
            _httpContextAccessor = httpContextAccessor;
            _appShare = appShare;
        }

        // GET: /JQueryAjaxCall/  
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> UnauthorizedPage()
        {
            Response.ClearAuthCookies();
            return View();
        }
        public async Task<IActionResult> InternalServerErrorPage()
        {
            Response.ClearAuthCookies();
            return View();
        }

        public async Task<IActionResult> ServiceUnavailablePage()
        {
            Response.ClearAuthCookies();
            return View();
        }

        /// <summary>
        /// DEV ONLY — bypass login, create fake claims, redirect to target page.
        /// Usage: /Login/DevAutoLogin?bnType=UC&redirect=/Verify/ManualKeyIn
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> DevAutoLogin(string bnType = "UC", string redirect = "/Verify/ManualKeyIn")
        {
            var env = HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>();
            if (!env.IsDevelopment())
                return NotFound();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "devuser"),
                new Claim("UserID", "1"),
                new Claim("UserNameId", "devuser"),
                new Claim("UserNameDisplay", "Dev User"),
                new Claim("FirstName", "สมวัลย์"),
                new Claim("Lastname", "มาดี"),
                new Claim("UserEmail", "dev@dev.local"),
                new Claim("IsExternalUser", "NO"),
                new Claim("RoleGroupId", "1"),
                new Claim("RoleGroupCode", "SUP"),
                new Claim("RoleGroupName", "Supervisor"),
                new Claim("RoleId", "1"),
                new Claim("RoleCode", "SUP"),
                new Claim("RoleName", "Supervisor"),
                new Claim("DepartmentId", "1"),
                new Claim("DepartmentCode", "DEV"),
                new Claim("DepartmentName", "Development"),
                new Claim("DepartmentShortName", "DEV"),
                new Claim("CbBcdCode", ""),
                new Claim("IsSendUnsortCc", "NO"),
                new Claim("IsPrepareCentral", "NO"),
                new Claim("StartDate", ""),
                new Claim("EndDate", ""),
                new Claim("CompanyId", "1"),
                new Claim("CompanyCode", "DEV"),
                new Claim("CompanyName", "Dev Company"),
                new Claim("ConfigBssUnfitQty", "100"),
                new Claim("ConfigBssStartTime", "08:00:00"),
                new Claim("ConfigBssEndTime", "20:00:00"),
                new Claim("ConfigBssWorkDay", "5"),
                new Claim("ConfigBssAlertShift", "1"),
                new Claim("ConfigBssBundle", "100"),
                new Claim("ShiftCode", "S1"),
                new Claim("ShiftName", "กะเช้า"),
                new Claim("ShiftStartTime", "08:00:00"),
                new Claim("ShiftEndTime", "16:00:00"),
                new Claim("BnType", bnType),
                new Claim("ExpireDateTime", DateTime.Now.AddHours(8).ToString()),
                new Claim("Machine", "1"),
                new Claim("SorterUserId", "1"),
                new Claim("AccessToken", "DEV_BYPASS_TOKEN"),
            };

            var identity = new ClaimsIdentity(claims, "CustomBssAuthentication");
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync("CustomBssAuthentication", principal);

            return Redirect(redirect);
        }

        [HttpGet]
        public async Task<IActionResult> GetBssUserDropdown()
        {
            var userData = await _bssAuthenService.GetUserLoginDropdownAsync();
            return Json(userData);
        }

        [HttpGet]
        public async Task<IActionResult> BssUserAuthen()
        {
            var result = new BaseServiceResult();
            string userName = string.Empty;
            string userLogonName = string.Empty;
            string sCertificate = string.Empty;

            var clientIp = _httpContextAccessor.HttpContext?.GetClientIpAddress();
            _logger.LogInformation("Client Ip:" + clientIp);

            if (AppConfig.IsExternalWeb == "Y")
            {
                #region /* For User External Authen */

                if (AppConfig.IsMockUserAuthen == "Y")
                {
                    sCertificate = "FDDB62AEB33773341BFA1BEB417A9F7A1E4221B6";
                    _logger.LogInformation("Mock Client Cert :" + sCertificate);
                }
                else
                {
                    var cert = HttpContext.Connection.ClientCertificate;
                    if (cert == null)
                    {
                        result.is_success = false;
                        result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                        result.msg_desc = "Unauthorized:No Client Certificate";
                        _logger.LogInformation("Unauthorized:No Client Certificate");
                        return Json(result);
                    }

                    string certSubject = cert.Subject ?? "";
                    string certIssuer = cert.Issuer ?? "";
                    string certSerialNumber = cert.SerialNumber ?? "";
                    string certThumbprint = cert.Thumbprint ?? "";
                    string certExpire = cert.NotAfter.ToString() ?? "";

                    _logger.LogInformation("Client Cert Subject: " + certSubject);
                    _logger.LogInformation("Client Cert Issuer: " + certIssuer);
                    _logger.LogInformation("Client Cert SerialNumber: " + certSerialNumber);
                    _logger.LogInformation("Client Cert Thumbprint: " + certThumbprint);
                    _logger.LogInformation("Client Cert Expire: " + certExpire);

                    var base64Cert = Convert.ToBase64String(cert.Export(X509ContentType.Cert));
                    _logger.LogInformation("Client Cert Base64: " + base64Cert);

                    sCertificate = base64Cert;
                }

                var tsLoginExternalResponse = await _bssAuthenService.UserExternalAuthenAsyn(sCertificate);
                if (tsLoginExternalResponse.is_success == false || tsLoginExternalResponse.data == null)
                {
                    if (tsLoginExternalResponse.msg_code == AppErrorType.DataNotFound.GetCategory())
                    {
                        result.is_success = false;
                        result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                        result.msg_desc = "Unauthorized: User External Authen Data Not Found.";
                        _logger.LogInformation("Unauthorized: User External Authen Data Not Found.");
                        return Json(result);
                    }

                    return Json(tsLoginExternalResponse);
                }

                userName = tsLoginExternalResponse.data.regID ?? "";

                #endregion /* For User External Authen */
            }
            else
            {
                #region /* For User Internal AD Authen */

                if (AppConfig.IsMockUserAuthen == "Y")
                {
                    userLogonName = "WattanaK";
                }
                else
                {
                    HttpContext? context = _httpContextAccessor.HttpContext;
                    userLogonName = InternalUserHelper.GetUserName(context);

                    if (string.IsNullOrWhiteSpace(userLogonName))
                    {
                        result.is_success = false;
                        result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                        result.msg_desc = "Unauthorized: Cannot retrieve current user data.";
                        _logger.LogInformation("Unauthorized: Cannot retrieve current user data.");
                        return Json(result);
                    }
                }

                var tsLoginInternalResponse = await _bssAuthenService.UserInternalAuthenAsyn(userLogonName);
                if (tsLoginInternalResponse.is_success == false || tsLoginInternalResponse.data == null)
                {
                    if (tsLoginInternalResponse.msg_code == AppErrorType.DataNotFound.GetCategory())
                    {
                        result.is_success = false;
                        result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                        result.msg_desc = "Unauthorized: User Internal Authen Data Not Found.";
                        _logger.LogInformation("Unauthorized: User Internal Authen Data Not Found.");
                        return Json(result);
                    }

                    return Json(tsLoginInternalResponse);
                }

                userName = tsLoginInternalResponse.data.objectGUID ?? "";

                #endregion  /* For User Internal AD Authen */
            }

            #region /* CheckUser Authorization */

            var authenResult = await _bssAuthenService.CheckUserAuthorizationAsyn(userName);
            if (authenResult.is_success == false || authenResult.data == null)
            {
                return Json(authenResult);
            }

            #endregion /* CheckUser Authorization */

            #region /* Assign AuthenticationApp Request Object  */

            var reqTokenData = new AuthenticationApp();
            reqTokenData.SystemName = AppConfig.SystemName;
            //User Info
            reqTokenData.UserID = authenResult.data.userInfo.userId.ToString();
            reqTokenData.UserNameID = authenResult.data.userInfo.userName ?? string.Empty;
            reqTokenData.UserNameDisplay = authenResult.data.userInfo.usernameDisplay ?? string.Empty;
            reqTokenData.FirstName = authenResult.data.userInfo.firstName ?? string.Empty;
            reqTokenData.LastName = authenResult.data.userInfo.lastName ?? string.Empty;
            reqTokenData.UserEmail = authenResult.data.userInfo.userEmail ?? string.Empty;
            reqTokenData.IsExternalUser = authenResult.data.userInfo.isInternal == true ? "NO" : "YES";
            // Role Group Info
            reqTokenData.RoleGroupId = authenResult.data.roleGroupInfo.roleGroupId.ToString();
            reqTokenData.RoleGroupCode = authenResult.data.roleGroupInfo.roleGroupCode ?? string.Empty;
            reqTokenData.RoleGroupName = authenResult.data.roleGroupInfo.roleGroupName ?? string.Empty;
            // Role Info
            reqTokenData.RoleId = authenResult.data.roleData[0].roleId.ToString();
            reqTokenData.RoleCode = authenResult.data.roleData[0].roleCode;
            reqTokenData.RoleName = authenResult.data.roleData[0].roleName;
            // Department Info
            reqTokenData.DepartmentId = authenResult.data.userCompanyDepartmentInfo.departmentId.ToString();
            reqTokenData.DepartmentCode = authenResult.data.userCompanyDepartmentInfo.departmentCode ?? string.Empty;
            reqTokenData.DepartmentName = authenResult.data.userCompanyDepartmentInfo.departmentName ?? string.Empty;
            reqTokenData.DepartmentShortName = authenResult.data.userCompanyDepartmentInfo.departmentShortName ?? string.Empty;
            reqTokenData.CbBcdCode = authenResult.data.userCompanyDepartmentInfo.cbBcdCode ?? string.Empty;
            reqTokenData.IsSendUnsortCc = authenResult.data.userCompanyDepartmentInfo.isSendUnsortCc == true ? "YES" : "NO";
            reqTokenData.IsPrepareCentral = authenResult.data.userCompanyDepartmentInfo.isPrepareCentral == true ? "YES" : "NO";
            reqTokenData.StartDate = authenResult.data.userCompanyDepartmentInfo.startDate ?? string.Empty;
            reqTokenData.EndDate = authenResult.data.userCompanyDepartmentInfo.endDate ?? string.Empty;
            // Company Info
            reqTokenData.CompanyId = authenResult?.data?.userCompanyDepartmentInfo.companyId.ToString() ?? string.Empty;
            reqTokenData.CompanyCode = authenResult?.data?.userCompanyDepartmentInfo.companyCode ?? string.Empty;
            reqTokenData.CompanyName = authenResult?.data?.userCompanyDepartmentInfo.companyName ?? string.Empty;
            // Config Info
            reqTokenData.ConfigBssUnfitQty = authenResult.data.configInfo.bssUnfitQty ?? string.Empty;
            reqTokenData.ConfigBssStartTime = authenResult.data.configInfo.bssStartTime ?? string.Empty;
            reqTokenData.ConfigBssEndTime = authenResult.data.configInfo.bssEndTime ?? string.Empty;
            reqTokenData.ConfigBssWorkDay = authenResult.data.configInfo.bssWorkDay ?? string.Empty;
            reqTokenData.ConfigBssAlertShift = authenResult.data.configInfo.bssAlertShift ?? string.Empty;
            reqTokenData.ConfigBssBundle = authenResult.data.configInfo.bssBundle ?? string.Empty;
            // Shift Info
            reqTokenData.ShiftCode = authenResult.data.shiftInfo.shiftCode ?? string.Empty;
            reqTokenData.ShiftName = authenResult.data.shiftInfo.shiftName ?? string.Empty;
            reqTokenData.ShiftStartTime = authenResult.data.shiftInfo.shiftStartTimeText ?? string.Empty;
            reqTokenData.ShiftEndTime = authenResult.data.shiftInfo.shiftEndTimeText ?? string.Empty;

            // Special 
            reqTokenData.BnType = "999";
            reqTokenData.Machine = "999";
            reqTokenData.SorterUserId = "999";
            reqTokenData.AccessToken = string.Empty;
            reqTokenData.ExpireDateTime = DateTime.Now.ToString();

            #endregion /* Assign AuthenticationApp Request Object  */

            #region /* Generate Token and Add Claim User *** [New Version] */

            var accessUser = new UserAccessData()
            {
                UserID = reqTokenData.UserID,
                UserRegisterID = reqTokenData.UserNameID,
                UserName = reqTokenData.UserNameDisplay,
                UserEmail = reqTokenData.UserEmail,
                RoleGroupID = reqTokenData.RoleGroupId,
                RoleID = reqTokenData.RoleId,
                DepartmentID = reqTokenData.DepartmentId,
                CompanyID = reqTokenData.CompanyId
            };

            var accessToken = await _bssAuthenService.GenerateAccessTokenJwt(accessUser);
            if (string.IsNullOrEmpty(accessToken))
            {
                result.is_success = false;
                result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                result.msg_desc = "Unauthorized: GenerateAccessToken Failed.";
                return Json(result);
            }

            DateTimeOffset? _expireDateTime = DateTimeOffset.Now.AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble());
            reqTokenData.AccessToken = accessToken;
            reqTokenData.ExpireDateTime = _expireDateTime.ToString() ?? "";

            var refreshTokenRequest = new CreateRefreshTokenRequest()
            {
                UserId = accessUser.UserID.AsInt(),
                IpAddress = clientIp
            };

            var refreshTokenResult = await _bssAuthenService.CreateRefreshTokenAsync(refreshTokenRequest);

            if (!refreshTokenResult.is_success || refreshTokenResult.data == null)
            {
                result.is_success = false;
                result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                result.msg_desc = "Unauthorized: CreateRefreshToken Failed.";
                return Json(result);
            }

            #region /* Set Cookies With HttpOnly Secure */

            Response.SetAccessTokenCookies(accessToken);
            Response.SetRefreshTokenCookies(refreshTokenResult?.data?.RefreshToken ?? string.Empty);
            Response.SetAuthCookies(CookieNameConstants.FirstName, reqTokenData.FirstName);
            Response.SetAuthCookies(CookieNameConstants.LastName, reqTokenData.LastName);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingGroup, reqTokenData.RoleGroupCode);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingId, reqTokenData.RoleId);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingCode, reqTokenData.RoleCode);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingName, reqTokenData.RoleName);
            Response.SetAuthCookies(CookieNameConstants.BanknoteTypeSetting, reqTokenData.BnType);
            Response.SetAuthCookies(CookieNameConstants.MachineSetting, reqTokenData.Machine);
            Response.SetAuthCookies(CookieNameConstants.SorterSetting, reqTokenData.SorterUserId);
            #endregion /* Set Cookies With HttpOnly Secure */

            #endregion /* Generate Token and Add Claim User *** [New Version] */

            result.is_success = authenResult.is_success;
            result.msg_code = authenResult.msg_code;
            result.msg_desc = authenResult.msg_desc;
            result.data = reqTokenData.RoleName;
            return Json(result);
        }

        [HttpPost]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.RefreshToken];
            if (refreshToken == null)
            {
                //return Unauthorized();
                return RedirectToRoute(new { controller = "Login", action = "Index" });
            }

            var requestData = new RefreshTokenAndNewGenerateRequest()
            {
                RefreshToken = refreshToken
            };

            var tokenResult = await _bssAuthenService.RefreshTokenAndRotationAsync(requestData);
            if (tokenResult == null || tokenResult.is_success == false)
            {
                var restUnauthorized = new BaseServiceResult()
                {
                    is_success = false,
                    msg_code = AppErrorType.AuthenticationFail.GetCategory(),
                    msg_desc = "Unauthorized",
                    data = null
                };

                return Json(restUnauthorized);
            }

            var accessUser = new UserAccessData()
            {
                UserID = _appShare.UserID.ToString(),
                UserRegisterID = _appShare.UserNameId,
                UserName = _appShare.UserNameDisplay,
                UserEmail = _appShare.UserEmail,
                RoleGroupID = _appShare.RoleGroupId.ToString(),
                RoleID = _appShare.RoleId.ToString(),
                DepartmentID = _appShare.DepartmentId.ToString(),
                CompanyID = _appShare.CompanyId.ToString()
            };

            var newAccessToken = await _bssAuthenService.GenerateAccessTokenJwt(accessUser);
            if (string.IsNullOrEmpty(newAccessToken))
            {
                var restUnauthorized = new BaseServiceResult()
                {
                    is_success = false,
                    msg_code = AppErrorType.AuthenticationFail.GetCategory(),
                    msg_desc = "Unauthorized",
                    data = null
                };

                return Json(restUnauthorized);
            }

            Response.SetAccessTokenCookies(newAccessToken);
            Response.SetRefreshTokenCookies(tokenResult?.data?.RefreshToken ?? string.Empty);

            return Json(tokenResult);
        }

        [HttpPost]
        public async Task<IActionResult> BssLogin([FromBody] LoginRequest request)
        {
            var result = new BaseServiceResult();
            string userName = string.Empty;

            if (string.IsNullOrWhiteSpace(request.userSelected))
            {
                result.is_success = false;
                result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                result.msg_desc = "Unauthorized";
                _logger.LogInformation("Unauthorized");
                return Json(result);
            }

            var clientIp = _httpContextAccessor.HttpContext?.GetClientIpAddress();
            _logger.LogInformation("Client Ip:" + clientIp);

            userName = request.userSelected.Trim();

            #region /* CheckUser Authorization */

            var authenResult = await _bssAuthenService.CheckUserAuthorizationAsyn(userName);
            if (authenResult.is_success == false || authenResult.data == null)
            {
                return Json(authenResult);
            }

            #endregion /* CheckUser Authorization */

            #region /* Assign AuthenticationApp Request Object  */

            var reqTokenData = new AuthenticationApp();
            reqTokenData.SystemName = AppConfig.SystemName;
            //User Info
            reqTokenData.UserID = authenResult.data.userInfo.userId.ToString();
            reqTokenData.UserNameID = authenResult.data.userInfo.userName ?? string.Empty;
            reqTokenData.UserNameDisplay = authenResult.data.userInfo.usernameDisplay ?? string.Empty;
            reqTokenData.FirstName = authenResult.data.userInfo.firstName ?? string.Empty;
            reqTokenData.LastName = authenResult.data.userInfo.lastName ?? string.Empty;
            reqTokenData.UserEmail = authenResult.data.userInfo.userEmail ?? string.Empty;
            reqTokenData.IsExternalUser = authenResult.data.userInfo.isInternal == true ? "NO" : "YES";
            // Role Group Info
            reqTokenData.RoleGroupId = authenResult.data.roleGroupInfo.roleGroupId.ToString();
            reqTokenData.RoleGroupCode = authenResult.data.roleGroupInfo.roleGroupCode ?? string.Empty;
            reqTokenData.RoleGroupName = authenResult.data.roleGroupInfo.roleGroupName ?? string.Empty;
            // Role Info
            reqTokenData.RoleId = authenResult.data.roleData[0].roleId.ToString();
            reqTokenData.RoleCode = authenResult.data.roleData[0].roleCode;
            reqTokenData.RoleName = authenResult.data.roleData[0].roleName;
            // Department Info
            reqTokenData.DepartmentId = authenResult.data.userCompanyDepartmentInfo.departmentId.ToString();
            reqTokenData.DepartmentCode = authenResult.data.userCompanyDepartmentInfo.departmentCode ?? string.Empty;
            reqTokenData.DepartmentName = authenResult.data.userCompanyDepartmentInfo.departmentName ?? string.Empty;
            reqTokenData.DepartmentShortName = authenResult.data.userCompanyDepartmentInfo.departmentShortName ?? string.Empty;
            reqTokenData.CbBcdCode = authenResult.data.userCompanyDepartmentInfo.cbBcdCode ?? string.Empty;
            reqTokenData.IsSendUnsortCc = authenResult.data.userCompanyDepartmentInfo.isSendUnsortCc == true ? "YES" : "NO";
            reqTokenData.IsPrepareCentral = authenResult.data.userCompanyDepartmentInfo.isPrepareCentral == true ? "YES" : "NO";
            reqTokenData.StartDate = authenResult.data.userCompanyDepartmentInfo.startDate ?? string.Empty;
            reqTokenData.EndDate = authenResult.data.userCompanyDepartmentInfo.endDate ?? string.Empty;
            // Company Info
            reqTokenData.CompanyId = authenResult?.data?.userCompanyDepartmentInfo.companyId.ToString() ?? string.Empty;
            reqTokenData.CompanyCode = authenResult?.data?.userCompanyDepartmentInfo.companyCode ?? string.Empty;
            reqTokenData.CompanyName = authenResult?.data?.userCompanyDepartmentInfo.companyName ?? string.Empty;
            // Config Info
            reqTokenData.ConfigBssUnfitQty = authenResult.data.configInfo.bssUnfitQty ?? string.Empty;
            reqTokenData.ConfigBssStartTime = authenResult.data.configInfo.bssStartTime ?? string.Empty;
            reqTokenData.ConfigBssEndTime = authenResult.data.configInfo.bssEndTime ?? string.Empty;
            reqTokenData.ConfigBssWorkDay = authenResult.data.configInfo.bssWorkDay ?? string.Empty;
            reqTokenData.ConfigBssAlertShift = authenResult.data.configInfo.bssAlertShift ?? string.Empty;
            reqTokenData.ConfigBssBundle = authenResult.data.configInfo.bssBundle ?? string.Empty;
            // Shift Info
            reqTokenData.ShiftCode = authenResult.data.shiftInfo.shiftCode ?? string.Empty;
            reqTokenData.ShiftName = authenResult.data.shiftInfo.shiftName ?? string.Empty;
            reqTokenData.ShiftStartTime = authenResult.data.shiftInfo.shiftStartTimeText ?? string.Empty;
            reqTokenData.ShiftEndTime = authenResult.data.shiftInfo.shiftEndTimeText ?? string.Empty;

            // Special 
            reqTokenData.BnType = "999";
            reqTokenData.Machine = "999";
            reqTokenData.SorterUserId = "999";
            reqTokenData.AccessToken = string.Empty;
            reqTokenData.ExpireDateTime = DateTime.Now.ToString();

            #endregion /* Assign AuthenticationApp Request Object  */

            #region /* Generate Token and Add Claim User *** [New Version] */

            var accessUser = new UserAccessData()
            {
                UserID = reqTokenData.UserID,
                UserRegisterID = reqTokenData.UserNameID,
                UserName = reqTokenData.UserNameDisplay,
                UserEmail = reqTokenData.UserEmail,
                RoleGroupID = reqTokenData.RoleGroupId,
                RoleID = reqTokenData.RoleId,
                DepartmentID = reqTokenData.DepartmentId,
                CompanyID = reqTokenData.CompanyId
            };

            var accessToken = await _bssAuthenService.GenerateAccessTokenJwt(accessUser);
            if (string.IsNullOrEmpty(accessToken))
            {
                result.is_success = false;
                result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                result.msg_desc = "Unauthorized: GenerateAccessToken Failed.";
                return Json(result);
            }

            DateTimeOffset? _expireDateTime = DateTimeOffset.Now.AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble());
            reqTokenData.AccessToken = accessToken;
            reqTokenData.ExpireDateTime = _expireDateTime.ToString() ?? "";

            var refreshTokenRequest = new CreateRefreshTokenRequest()
            {
                UserId = accessUser.UserID.AsInt(),
                IpAddress = clientIp
            };

            var refreshTokenResult = await _bssAuthenService.CreateRefreshTokenAsync(refreshTokenRequest);

            if (!refreshTokenResult.is_success || refreshTokenResult.data == null)
            {
                result.is_success = false;
                result.msg_code = AppErrorType.AuthenticationFail.GetCategory();
                result.msg_desc = "Unauthorized: CreateRefreshToken Failed.";
                return Json(result);
            }

            #region /* Set Cookies With HttpOnly Secure */

            Response.SetAccessTokenCookies(accessToken);
            Response.SetRefreshTokenCookies(refreshTokenResult?.data?.RefreshToken ?? string.Empty);
            Response.SetAuthCookies(CookieNameConstants.FirstName, reqTokenData.FirstName);
            Response.SetAuthCookies(CookieNameConstants.LastName, reqTokenData.LastName);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingGroup, reqTokenData.RoleGroupCode);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingId, reqTokenData.RoleId);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingCode, reqTokenData.RoleCode);
            Response.SetAuthCookies(CookieNameConstants.OperationSettingName, reqTokenData.RoleName);
            Response.SetAuthCookies(CookieNameConstants.BanknoteTypeSetting, reqTokenData.BnType);
            Response.SetAuthCookies(CookieNameConstants.MachineSetting, reqTokenData.Machine);
            Response.SetAuthCookies(CookieNameConstants.SorterSetting, reqTokenData.SorterUserId);
            #endregion /* Set Cookies With HttpOnly Secure */

            #endregion /* Generate Token and Add Claim User *** [New Version] */

            result.is_success = authenResult.is_success;
            result.msg_code = authenResult.msg_code;
            result.msg_desc = authenResult.msg_desc;
            result.data = reqTokenData.RoleName;
            return Json(result);
        }
    }
}
