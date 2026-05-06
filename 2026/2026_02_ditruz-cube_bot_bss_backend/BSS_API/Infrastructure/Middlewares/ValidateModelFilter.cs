
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BSS_API.Infrastructure.Middlewares
{ 
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        private readonly string _message = "Invalid request data";

        public ValidateModelAttribute()
        {

        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                // Return simple text message in 400 Bad Request
                context.Result = new BadRequestObjectResult(_message);
            }
        }
    }

}
