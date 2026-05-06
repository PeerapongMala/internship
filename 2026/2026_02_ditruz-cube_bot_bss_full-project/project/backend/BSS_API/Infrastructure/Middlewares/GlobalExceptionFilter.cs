using BSS_API.Core.CustomException;
using BSS_API.Helpers;
using BSS_API.Models.ResponseModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
namespace BSS_API.Infrastructure.Middlewares
{
    public class GlobalExceptionFilter: IExceptionFilter
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;

        public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
        {
            _logger = logger;   
        }

        public void OnException(ExceptionContext context)
        {
            var controllerName = context.RouteData.Values["controller"];
            var actionName = context.RouteData.Values["action"];
            string msgCode = string.Empty;
            string msgDesc = string.Empty;
            string exceptionMessage = string.Empty;
            int statusCode = 500;

            exceptionMessage = context.Exception.GetErrorMessage();

            string log_message = $"Error:{msgCode}, Controller: {controllerName}, Action: {actionName}, Exception Message: {exceptionMessage}";
            _logger.LogError(log_message);
            _logger.LogError(context.Exception.ToString());

            switch (context.Exception)
            {
                //if the exception message is for user about business rule or exception, throw new BusinessException("Your message"):
                case BusinessException:
                    statusCode = AppErrorType.BadRequest.GetCategory().AsInt();
                    msgCode = AppErrorType.BadRequest.GetCategory();
                    msgDesc = exceptionMessage ;
                    break;
                /*
                case AggregateException:
                    statusCode = AppErrorType.InvalidInputDataFormat.GetCategory().AsInt();
                    msgCode = AppErrorType.InvalidInputDataFormat.GetCategory();
                    msgDesc = string.IsNullOrEmpty(exceptionMessage) ? AppErrorType.InvalidInputDataFormat.GetDescription() : exceptionMessage;
                    break;
                case InvalidOperationException:
                    statusCode = AppErrorType.DataNotFound.GetCategory().AsInt();
                    msgCode = AppErrorType.DataNotFound.GetCategory();
                    msgDesc = string.IsNullOrEmpty(exceptionMessage) ? AppErrorType.DataNotFound.GetDescription() : exceptionMessage;
                    break;
                */
                //Everything else will return as "Internal Server Error" no technical error detail return
                default:
                    statusCode = AppErrorType.InternalServiceError.GetCategory().AsInt();
                    msgCode = AppErrorType.InternalServiceError.GetCategory();
                    msgDesc = AppErrorType.InternalServiceError.GetDescription(); //string.IsNullOrEmpty(exceptionMessage) ? AppErrorType.InternalServiceError.GetDescription() : exceptionMessage;
                    break;
            }

            

            var result =  new ErrorResponse
            {
                is_success = false,
                msg_code = msgCode,
                msg_desc = msgDesc
            };

            context.Result = new JsonResult(result)
            {
                StatusCode = statusCode
            };

            context.ExceptionHandled = true;
        }
    }
}
