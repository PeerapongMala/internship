using BSS_API.Helpers;
using BSS_API.Models.ResponseModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace BSS_API.Infrastructure.Middlewares
{
    public class RequestLogMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<RequestLogMiddleware> _logger;

        public RequestLogMiddleware(RequestDelegate next, ILogger<RequestLogMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var startDate = DateTime.Now;
            var requestBody = string.Empty;
            var responseBody = string.Empty;
            var path = context.Request.Path;
            string? controllerName = string.Empty;
            string?  actionName = string.Empty;
            string requestId = RequestContextHelper.GetRequestId(); 
            Stream originalResponseBody = null;
            var newResponseBody = new MemoryStream();
            string result_message = string.Empty;
            try
            {
                if (IgnorePath(path))
                {
                    await _next(context);
                    return;
                }

                controllerName = context.GetRouteValue("controller").AsString();
                actionName = context.GetRouteValue("action").AsString();

                context.Request.EnableBuffering();
                using (var requestMem = new MemoryStream())
                {
                    using (var reader = new StreamReader(requestMem))
                    {
                        await context.Request.Body.CopyToAsync(requestMem);
                        context.Request.Body.Seek(0, SeekOrigin.Begin);
                        requestMem.Seek(0, SeekOrigin.Begin);
                        requestBody = await reader.ReadToEndAsync();
                    }
                }

                _logger.LogInformation($"CallerPath:{path}");
                _logger.LogInformation($"RequestBody:{requestBody}");

                originalResponseBody = context.Response.Body;
                context.Response.Body = newResponseBody;

                _logger.LogInformation($"[Start] - Controller: {controllerName} , Action: {actionName} - Start");
                await _next(context);
                _logger.LogInformation($"[Finish] - Controller: {controllerName} , Action: {actionName} - Finish");

                newResponseBody.Seek(0, SeekOrigin.Begin);
                responseBody = await new StreamReader(newResponseBody, System.Text.Encoding.UTF8).ReadToEndAsync();
                newResponseBody.Seek(0, SeekOrigin.Begin);
                await newResponseBody.CopyToAsync(originalResponseBody);

            }
            catch (Exception ex)
            {
                result_message = ex.GetErrorMessage();

                var result = new ErrorResponse
                {
                    is_success = false,
                    msg_code = AppErrorType.InternalServiceError.GetCategory(),
                    msg_desc = string.IsNullOrEmpty(result_message) ? AppErrorType.InternalServiceError.GetDescription() : result_message,
                };

                //var error = new { success = false, message = $"Internal Service Error : RequestLogMiddleware Error Exception:{ex.Message}" };
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                responseBody = JsonConvert.SerializeObject(result);
                _logger.LogError($"Error:{responseBody}");

                await context.Response.WriteAsync(responseBody);

                newResponseBody.Seek(0, SeekOrigin.Begin);
                await newResponseBody.CopyToAsync(originalResponseBody);
            }

            _logger.LogInformation($"ResponseBody:{responseBody}");

            //LogWarning
            //LogError

            var auditLog = new BSS_API.Models.ObjectModels.AuditLogData
            {
                UserId = RequestContextHelper.GetUserId(),
                Controller = controllerName,
                Action = actionName,
                RequestBody = requestBody,
                StatusCode = context.Response.StatusCode,
                ErrorMessage = result_message,
                RequestId = requestId,
                CreatedDate = startDate
            };
            //Pol Note: To do: call service to insert
            //await _auditLogService.SaveAsync(auditLog);

        }

        private bool IgnorePath(string path)
        {
            var listIgnores = new List<string> {
                "^/?$",
                "^/?alive.*",
                "^/?swagger.*",
                "^/?favicon\\.ico.*"
            };
            return listIgnores.Any(m => Regex.IsMatch(path, m));
        }
    }
}
