using Microsoft.AspNetCore.Mvc.Filters;

namespace BSS_API.Infrastructure.Middlewares
{
    public class LoggingActionFilter : ActionFilterAttribute
    {
        private readonly ILogger<LoggingActionFilter> _logger;
        public LoggingActionFilter(ILogger<LoggingActionFilter> logger)
        {
            _logger = logger;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var controllerName = context.RouteData.Values["controller"];
            var actionName = context.RouteData.Values["action"];
            //_logger.LogInformation($"Controller: {controllerName} , Action: {actionName} - Start");
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var controllerName = context.RouteData.Values["controller"];
            var actionName = context.RouteData.Values["action"];
            //_logger.LogInformation($"Controller: {controllerName} , Action: {actionName} - Finish");
        }
    }
}
