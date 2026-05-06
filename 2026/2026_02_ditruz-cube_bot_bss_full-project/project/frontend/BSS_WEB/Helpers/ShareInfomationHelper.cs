using BSS_WEB.Core.Constants;
using System.Security.Claims;

namespace BSS_WEB.Helpers
{
    public static class ShareInfomationHelper
    {
        public static string GetUserId(HttpContext? context)
        {
            if (context == null)
                return string.Empty;

            var principal = GetUserDataFromPrincipal(context);
            if (principal == null) return string.Empty;

            string resultValue = string.Empty;
            resultValue = principal.FindFirst("UserID")?.Value ?? string.Empty;

            return resultValue ?? string.Empty;
        }

        public static string GetSessionTraceIdentifierId(HttpContext? context)
        {
            return $"{context?.TraceIdentifier}";
        }

        private static ClaimsPrincipal? GetUserDataFromPrincipal(HttpContext? context)
        {
            string valueData = string.Empty;
            var token = context?.Request.Cookies[CookieNameConstants.AccessToken] ?? string.Empty;
            if (string.IsNullOrEmpty(token))
                return null;

            return TokenHelper.ValidateJwtToken(token);
        }
    }
}
