using BSS_API.Helpers;
using BSS_API.Models.ResponseModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace BSS_API.Controllers
{

    public class BaseController : Controller
    {
        private readonly IAppShare _share;
        public BaseController(IAppShare share)
        {
            _share = share;
        }
        protected IActionResult ApiSuccess<T>(T data)
        {
            var response = new BaseResponse<T>
            {
                is_success = true,
                msg_code = AppErrorType.Success.GetCategory(),
                msg_desc = AppErrorType.Success.GetDescription(),
                data = data
            };
            return Ok(response);
        }
        protected IActionResult ApiDataNotFound(string? customMessage = null)
        {
            var response = new BaseResponse<object>
            {
                is_success = false,
                msg_code = AppErrorType.DataNotFound.GetCategory(),
                msg_desc = string.IsNullOrEmpty(customMessage)
                    ? AppErrorType.DataNotFound.GetDescription()
                    : customMessage,
                data = null
            };
            return Ok(response);
        }
        protected IActionResult ApiDataDuplicate(string? customMessage = null)
        {
            var response = new BaseResponse<object>
            {
                is_success = false,
                msg_code = AppErrorType.DuplicateData.GetCategory(),
                msg_desc = string.IsNullOrEmpty(customMessage)
                    ? AppErrorType.DuplicateData.GetDescription()
                    : customMessage,
                data = null
            };
            return Ok(response);
        }

        protected IActionResult ApiBadRequest(string? customMessage = null)
        {
            var response = new BaseResponse<object>
            {
                is_success = false,
                msg_code = AppErrorType.InvalidInputDataFormat.GetCategory(),
                msg_desc = string.IsNullOrEmpty(customMessage)
                    ? AppErrorType.InvalidInputDataFormat.GetDescription()
                    : customMessage,
                data = null
            };
            return BadRequest(response);
        }

        protected IActionResult ApiInternalServerError(string? customMessage = null)
        {
            var response = new BaseResponse<object>
            {
                is_success = false,
                msg_code = AppErrorType.InternalServiceError.GetCategory(),
                msg_desc = string.IsNullOrEmpty(customMessage)
                    ? AppErrorType.InternalServiceError.GetDescription()
                    : customMessage,
                data = null
            };

            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }
        /// <summary>
        /// Returns a BadRequest result for invalid model state
        /// </summary>
        protected ObjectResult GetInvalidModelOkObjectResult(
            string errorCode,
            [CallerMemberName] string callerName = null,
            [CallerFilePath] string callerPath = null,
            [CallerLineNumber] int callerLineNo = 0)
        {
            var parameter = JsonConvert.SerializeObject(
                ModelState.Values
                          .SelectMany(m => m.Errors)
                          .Select(e => e.ErrorMessage)
                          .ToList()
            );

            //_share.Error(
            //    $"{AppErrorType.InvalidInputDataFormat.GetDescription()} Error Code:{errorCode}{Environment.NewLine}\tParameter:{parameter}",
            //    callerName,
            //    callerPath
            //);


            Response.SetResponseHeader(errorCode, AppErrorType.InvalidInputDataFormat.GetDescription(), "n/a");

            return BadRequest(AppErrorType.InvalidInputDataFormat.GetInvalidInputErrorResponse(
                errorCode,
                parameter: parameter,
                callerName: callerName,
                callerLineNo: callerLineNo
            ));
        }

        /// <summary>
        /// Returns an OkObjectResult for a standard BaseResponse
        /// </summary>
        protected OkObjectResult GetObjectResult<TData>(BaseResponse<TData> response)
        {
            return Ok(response);
        }

        /// <summary>
        /// Returns an OkObjectResult for a CBMS-specific BaseCbmsResponse
        /// </summary>
        protected OkObjectResult GetCbmsObjectResult<TData>(BaseCbmsResponse<TData> response)
        {
            return Ok(response);
        }

        /// <summary>
        /// Returns an OkObjectResult for exceptions
        /// </summary>
        protected OkObjectResult GetExceptionOkObjectResult(
            string errorCode,
            Exception ex,
            [CallerMemberName] string callerName = null,
            [CallerLineNumber] int callerLineNo = 0,
            [CallerFilePath] string callerPath = null)
        {
            //_share.LogError(
            //    $"Error:{errorCode} Exception Message:{ex.GetErrorMessage()}",
            //    callerName,
            //    callerPath
            //);

            var msg = AppErrorType.InternalServiceError.GetDescription();
            Response.SetResponseHeader(errorCode, msg, "n/a");

            return Ok(AppErrorType.InternalServiceError.GetErrorResponse(
                errorCode,
                ex.GetErrorMessage(),
                callerName: callerName,
                callerLineNo: callerLineNo
            ));
        }

        /// <summary>
        /// Gets the current user ID from claims
        /// </summary>
        protected int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            return 1; // Default fallback
        }
    }

    /*
        public class BaseController : Controller
        {

            private readonly IAppShare _share;
           // private readonly ILogger<BaseController> _logger;

            public BaseController(IAppShare share)
            {
                _share = share;
            }

            protected async Task<ObjectResult> GetInvalidModelOkObjectResult(string errorCode, [CallerMemberName] string callerName = null, [CallerFilePath] string callerPath = null, [CallerLineNumber] int callerLineNo = 0)
            {
                return await Task.Run(() =>
                {
                    var parameter = JsonConvert.SerializeObject(ModelState.Values.SelectMany(m => m.Errors)
                                     .Select(e => e.ErrorMessage)
                                     .ToList());
                    _share.LogError($"{AppErrorType.InvalidInputDataFormat.GetDescription()} Error Code:{errorCode}{Environment.NewLine}\tParameter:{parameter}", callerName, callerPath);

                    Response.SetResponseHeader(errorCode, AppErrorType.InvalidInputDataFormat.GetDescription(), "n/a");

                    return BadRequest(AppErrorType.InvalidInputDataFormat.GetInvalidInputErrorResponse(errorCode, parameter: parameter, callerName: callerName, callerLineNo: callerLineNo));
                });
            }

            protected async Task<OkObjectResult> GetObjectResult<TData>(BaseResponse<TData> response, [CallerMemberName] string callerName = null, [CallerFilePath] string callerPath = null)
            {
                return await Task.Run(() =>
                {
                    return Ok(response);
                });
            }

            protected async Task<OkObjectResult> GetCbmsObjectResult<TData>(BaseCbmsResponse<TData> response, [CallerMemberName] string callerName = null, [CallerFilePath] string callerPath = null)
            {
                return await Task.Run(() =>
                {
                    return Ok(response);
                });
            }

            protected async Task<OkObjectResult> GetExceptionOkObjectResult(string errorCode, Exception ex, [CallerMemberName] string callerName = null, [CallerLineNumber] int callerLineNo = 0, [CallerFilePath] string callerPath = null)
            {
                return await Task.Run(() =>
                {
                    _share.LogError($"Error:{errorCode} Exception Message:{ex.GetErrorMessage()}", callerName, callerPath);
                    var msg = AppErrorType.InternalServiceError.GetDescription();
                    Response.SetResponseHeader(errorCode, msg, "n/a");
                    return Ok(AppErrorType.InternalServiceError.GetErrorResponse(errorCode, ex.GetErrorMessage(), callerName: callerName, callerLineNo: callerLineNo));
                });
            }

        }

    */
}
