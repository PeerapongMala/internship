using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Playwright;
using System.IdentityModel.Tokens.Jwt;

namespace BSS_WEB.Infrastructure
{
    public class RefreshTokenFilter : IAsyncActionFilter
    {
        private readonly IBssAuthenticationService _tokenService;

        public RefreshTokenFilter(IBssAuthenticationService tokenService)
        {
            _tokenService = tokenService;
        }

        public async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
        {
            var refreshToken = context.HttpContext.GetCookiesByKey(CookieNameConstants.RefreshToken) ?? string.Empty;

            if (!string.IsNullOrEmpty(refreshToken))
            {
                var accessToken = context.HttpContext.GetCookiesByKey(CookieNameConstants.AccessToken) ?? string.Empty;

                if (string.IsNullOrEmpty(accessToken))
                {
                    HandleUnauthorized(context);
                    return;
                }

                var principal = TokenHelper.ValidateJwtToken(accessToken);
                if (principal != null)
                {
                    var jwtHandler = new JwtSecurityTokenHandler();

                    if (jwtHandler.CanReadToken(accessToken))
                    {
                        var jwtData = jwtHandler.ReadJwtToken(accessToken);
                        var remaining = jwtData.ValidTo.AddHours(7) - DateTime.Now;
                        var totalLifetime = TimeSpan.FromMinutes(AppConfig.JwtExpiryMinutes.AsDouble());

                        if (remaining < totalLifetime * 0.3)  // Silent Refresh < 30% อายุ Token
                        {
                            var requestData = new RefreshTokenAndNewGenerateRequest()
                            {
                                RefreshToken = refreshToken
                            };

                            var tokenResult = await _tokenService.RefreshTokenAndRotationAsync(requestData);

                            if (tokenResult.is_success == false || tokenResult == null )
                            {
                                HandleUnauthorized(context);
                                return;
                            }

                            var accessUser = new UserAccessData()
                            {
                                UserID = principal.FindFirst("UserID")?.Value ?? "",
                                UserRegisterID = principal.FindFirst("UserRegisterID")?.Value ?? "",
                                UserName = principal.FindFirst("UserName")?.Value ?? "",
                                UserEmail = principal.FindFirst("UserEmail")?.Value ?? "",
                                RoleGroupID = principal.FindFirst("RoleGroupID")?.Value ?? "",
                                RoleID = principal.FindFirst("RoleID")?.Value ?? "",
                                DepartmentID = principal.FindFirst("DepartmentID")?.Value ?? "",
                                CompanyID = principal.FindFirst("CompanyID")?.Value ?? ""
                            };

                            var newAccessToken = await _tokenService.GenerateAccessTokenJwt(accessUser);
                            if (!string.IsNullOrEmpty(newAccessToken))
                            {
                                context.HttpContext.Response.SetAccessTokenCookies(newAccessToken);
                                context.HttpContext.Response.SetRefreshTokenCookies(tokenResult?.data?.RefreshToken ?? string.Empty);
                            }
                            else
                            {
                                HandleUnauthorized(context);
                                return;
                            }
                        }
                    }
                    else
                    {
                        HandleUnauthorized(context);
                        return;
                    }
                }
                else
                {
                    HandleUnauthorized(context);
                    return;
                }
            }
            else
            {
                HandleUnauthorized(context);
                return;
            }

            await next();
        }


        private void HandleUnauthorized(ActionExecutingContext context)
        {
            context.Result = new RedirectToRouteResult(new RouteValueDictionary {
                { "action", "UnauthorizedPage"},
                { "controller", "Login"}
            });
        }
    }
}
