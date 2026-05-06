using Microsoft.AspNetCore.Http;

namespace BSS_API.Helpers
{
    public static class RequestContextHelper
    {
        private static IHttpContextAccessor? _contextAccessor;

        public static void Configure(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        private static HttpContext? Current => _contextAccessor?.HttpContext;

        // Generic helper to safely read headers
        private static string? GetHeader(string key)
        {
            if (Current?.Request?.Headers.TryGetValue(key, out var value) == true)
                return value.ToString();
            return null;
        }

        // --- Custom header helpers ---

        public static string GetRequestId()
        {
            var id = GetHeader("x-request-id");
            if (!string.IsNullOrWhiteSpace(id)) {
                return id;
            }
            else {
                string traceId = "api-auto-" + Current?.TraceIdentifier;
                return traceId;
            }
                 
        }



        public static int GetUserId()
        {
            // Priority: header > authenticated user id
            string headerKey = "x-user-id";
            var fromHeader = GetHeader(headerKey);
            if (int.TryParse(fromHeader, out int userId))
            {
                return userId;
            }
            else {
                if (AppConfig.Environment != "Development")
                {
                    throw new Exception($"Invalid {headerKey}");
                }
                return 0;
            }
             
             
        }

        public static string? GetClientIp()
        {
            return Current?.Connection?.RemoteIpAddress?.ToString();
        }

        public static string? GetUserAgent()
        {
            return GetHeader("User-Agent");
        }

        public static string? GetPath()
        {
            return Current?.Request?.Path.ToString();
        }
    }
}
