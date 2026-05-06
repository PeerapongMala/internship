using BSS_WEB.Core.Constants;
using BSS_WEB.Models.ObjectModel;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2016.Excel;
using System.Security.Claims;

namespace BSS_WEB.Helpers
{
    public class UserInfoHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserInfoHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        #region /* User Info */

        public string UserID
        {
            get
            {
                string value = string.Empty;
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    value = principal.FindFirst("UserID")?.Value ?? "0";
                }
                else
                {
                    value = "0";
                }

                return value;
            }
        }

        #endregion /* User Info */

        #region /* Department Info */

        public string DepartmentId
        {
            get
            {
                string value = string.Empty;
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    value = principal.FindFirst("DepartmentID")?.Value ?? "0";
                }
                else
                {
                    value = "0";
                }

                return value;
            }
        }

        #endregion /* Department Info */

        #region /* Company Info */

        public string CompanyId
        {
            get
            {
                string value = string.Empty;
                var principal = GetUserDataFromPrincipal();
                if (principal != null)
                {
                    value = principal.FindFirst("CompanyID")?.Value ?? "0";
                }
                else
                {
                    value = "0";
                }
                return value;
            }
        }

        #endregion /* Company Info */

        public string Machine
        {
            get
            {
                string value = _httpContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.MachineSetting] ?? "0"; ;
                return value;
            }
        }



        #region /* Special */



        public AuthenticationApp GetUserInfo
        {
            get
            {
                AuthenticationApp app = new AuthenticationApp();
                app = GetUserInformation();
                return app;
            }
        }

        #endregion /* Special */

        private AuthenticationApp GetUserInformation()
        {
            var appUser = new AuthenticationApp();

            var currentUser = GetUserDataFromPrincipal();

            if (currentUser != null)
            {
                //User Info
                appUser.UserNameID = currentUser.FindFirst("UserRegisterID")?.Value ?? "";
                appUser.UserID = currentUser.FindFirst("UserID")?.Value ?? "";
                // Role Info
                appUser.RoleId = _httpContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.OperationSettingId] ?? "0";
                // Department Info
                appUser.DepartmentId = currentUser.FindFirst("DepartmentID")?.Value ?? "";
                // Company Info
                appUser.CompanyId = currentUser.FindFirst("CompanyID")?.Value ?? "";

                appUser.Machine = _httpContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.MachineSetting] ?? "0";
            }
            else
            {
                appUser = new AuthenticationApp();
            }

            return appUser;
        }

        private ClaimsPrincipal? GetUserDataFromPrincipal()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Cookies[CookieNameConstants.AccessToken] ?? string.Empty;
            if (string.IsNullOrEmpty(token))
                return null;

            var principal = TokenHelper.ValidateJwtToken(token);
            return principal;
        }
    }
}
