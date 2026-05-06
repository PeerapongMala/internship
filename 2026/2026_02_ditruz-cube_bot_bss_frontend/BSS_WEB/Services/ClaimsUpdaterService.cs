using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using BSS_WEB.Interfaces;

namespace BSS_WEB.Services
{
    public class ClaimsUpdaterService : IClaimsUpdaterService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ClaimsUpdaterService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task UpdateClaimAsync(string type, string value)
        {
            ClaimsIdentity? identity = _httpContextAccessor.HttpContext?.User?.Identity as ClaimsIdentity;
            if (identity == null)
                return;

            // Remove old claim
            var oldClaim = identity.FindFirst(type);
            if (oldClaim != null)
                identity.RemoveClaim(oldClaim);

            // Add updated claim
            identity.AddClaim(new Claim(type, value));


            // Re-sign in (update cookie)
            await _httpContextAccessor.HttpContext.SignInAsync("CustomBssAuthentication", new ClaimsPrincipal(identity));

        }
    }
}
