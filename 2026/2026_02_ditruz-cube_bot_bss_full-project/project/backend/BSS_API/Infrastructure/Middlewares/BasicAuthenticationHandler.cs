/*
using BSS_API.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace BSS_API.Infrastructure.Middlewares
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private const string APIKEY = "x-api-key";
        private readonly IAppShare _share;

        public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IAppShare share)
        : base(options, logger, encoder, clock)
        {
            _share = share;
        }


        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (Request.Path.ToString().IgnorePath())
            {
                var claimsIgnore = new[] {
                        new Claim(ClaimTypes.Sid,"IgnorePath")
                    };
                var identityIgnore = new ClaimsIdentity(claimsIgnore, Scheme.Name);
                var principalIgnore = new ClaimsPrincipal(identityIgnore);
                var ticketIgnore = new AuthenticationTicket(principalIgnore, Scheme.Name);
                return AuthenticateResult.Success(ticketIgnore);
            }

            if (!ValidateHeader(Request.Headers))
            {                
                _share.LogInformation("Missing Api Key From Header");
                return AuthenticateResult.Fail("Missing Api Key From Header");
            }


            if (!ValidateToken(Request))
            {
                 
                _share.LogInformation("Unauthorized : Invalid Api Key");
                return AuthenticateResult.Fail("Unauthorized : Invalid Api Key");
            }

            var identityID = $"{DateTime.Now.ToString("yyyyMMddHHmmss")}-{Request.Headers[APIKEY].ToString()}";
            var claims = new[] {
                    new Claim(ClaimTypes.NameIdentifier, identityID),
                    new Claim(ClaimTypes.Name, identityID)
            };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

        
            _share.LogInformation("Authentication Success");
            return AuthenticateResult.Success(ticket);
        }

        public bool ValidateHeader(IHeaderDictionary headers)
        {
            var xApiKey = headers[APIKEY];
            if (string.IsNullOrEmpty(xApiKey)) return false;

            return true;
        }

        public bool ValidateToken(HttpRequest request)
        {
            var result = true;
            try
            {
                var extractedApiKey = request.Headers[APIKEY];

                var token = AppConfig.XApiKey;

                if (!token.Equals(extractedApiKey))
                {
                    result = false;
                }
            }
            catch
            {
                result = false;
            }
            return result;
        }
    }
}
*/
