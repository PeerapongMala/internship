using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BSS_WEB.Infrastructure
{
    public class AuthenticationRequestFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                var token = context.HttpContext.GetCookiesByKey(CookieNameConstants.AccessToken) ?? string.Empty;

                if (string.IsNullOrEmpty(token))
                {
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary {
                                                                    { "action", "UnauthorizedPage"},
                                                                    { "controller", "Login"}
                                                                });
                }


                var principal = TokenHelper.ValidateJwtToken(token);

                if (principal == null || principal?.Identity?.IsAuthenticated == false)
                {
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary {
                                                                    { "action", "UnauthorizedPage"},
                                                                    { "controller", "Login"}
                                                                });


                }
                else
                {
                    string userId = principal.FindFirst("UserID")?.Value;
                }

            }
            catch (Exception ex)
            {
                context.Result = new ContentResult
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Content = ex.Message
                };
            }

        }

    }

    public class AuthenticationActionFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                var token = context.HttpContext.GetCookiesByKey(CookieNameConstants.AccessToken) ?? string.Empty;

                if (string.IsNullOrEmpty(token))
                {
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary {
                                                                    { "action", "UnauthorizedPage"},
                                                                    { "controller", "Login"}
                                                                });
                }


                var principal = TokenHelper.ValidateJwtToken(token);

                if (principal == null || principal?.Identity?.IsAuthenticated == false)
                {
                    context.Result = new RedirectToRouteResult(new RouteValueDictionary {
                                                                    { "action", "UnauthorizedPage"},
                                                                    { "controller", "Login"}
                                                                });


                }
                else
                {
                    string userId = principal.FindFirst("UserID")?.Value;
                }
            }
            catch (Exception ex)
            {
                context.Result = new ContentResult
                {
                    Content = ex.Message,
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }
}
