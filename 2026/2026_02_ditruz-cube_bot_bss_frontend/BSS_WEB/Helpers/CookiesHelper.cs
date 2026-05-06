using BSS_WEB.Core.Constants;
using DocumentFormat.OpenXml.Math;
using Microsoft.Playwright;

namespace BSS_WEB.Helpers
{
    public static class CookiesHelper
    {
        public static void SetAuthCookies(this HttpResponse response, string cookieKey, string cookieValue)
        {
            DateTimeOffset? _expireDateTime = DateTime.Now.AddDays(AppConfig.RefreshTokenExpiryDays.AsDouble()).AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble());

            response.Cookies.Append(cookieKey, cookieValue, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = _expireDateTime
            });
        }

        public static void SetAccessTokenCookies(this HttpResponse response, string accessToken)
        {
            DateTimeOffset? _expireDateTime = DateTimeOffset.Now.AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble());

            response.Cookies.Append(CookieNameConstants.AccessToken, accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = _expireDateTime
            });
        }

        public static void SetRefreshTokenCookies(this HttpResponse response, string refreshToken)
        {
            DateTimeOffset? _expireDateTime = DateTime.Now.AddDays(AppConfig.RefreshTokenExpiryDays.AsDouble()).AddMinutes(AppConfig.JwtExpiryMinutes.AsDouble());

            response.Cookies.Append(CookieNameConstants.RefreshToken, refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = _expireDateTime
            });
        }

        public static string? GetCookiesByKey(this HttpContext context, string cookieKey )
        {
            if(string.IsNullOrEmpty(cookieKey)) return null;

            return context.Request.Cookies[cookieKey] ?? string.Empty;
        }

        public static void ClearAuthCookies(this HttpResponse response)
        {
            response.Cookies.Delete(CookieNameConstants.AccessToken);
            response.Cookies.Delete(CookieNameConstants.RefreshToken);
            response.Cookies.Delete(CookieNameConstants.FirstName);
            response.Cookies.Delete(CookieNameConstants.LastName);
            response.Cookies.Delete(CookieNameConstants.OperationSettingGroup);
            response.Cookies.Delete(CookieNameConstants.OperationSettingId);
            response.Cookies.Delete(CookieNameConstants.OperationSettingCode);
            response.Cookies.Delete(CookieNameConstants.OperationSettingName);
            response.Cookies.Delete(CookieNameConstants.BanknoteTypeSetting);
            response.Cookies.Delete(CookieNameConstants.MachineSetting);
            response.Cookies.Delete(CookieNameConstants.SorterSetting);
        }
    }
}
