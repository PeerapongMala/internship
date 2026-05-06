using BSS_API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;

namespace BSS_API.Infrastructure.Middlewares
{

    public class ApiKeyFilter : IAuthorizationFilter
    {
        private readonly string _systemCode; 

        public ApiKeyFilter(string systemCode)
        {
            _systemCode = systemCode; 
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            const string HEADER = "x-api-key";

            if (!context.HttpContext.Request.Headers.TryGetValue(HEADER, out var providedKey))
            {
                context.Result = new UnauthorizedObjectResult(new { error = "Missing API Key" });
                return;
            }

            var expectedKey = AppConfig.XApiKey(_systemCode);
            if (string.IsNullOrWhiteSpace(expectedKey))
            {
                context.Result = new UnauthorizedObjectResult(new { error = $"Invalid API Key for system {_systemCode}" });
                return;
            }

            if (!string.Equals(providedKey, expectedKey, StringComparison.Ordinal))
            {
                context.Result = new UnauthorizedObjectResult(new { error = "Invalid API Key" });
            }
        }
    }
}





