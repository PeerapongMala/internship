using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
namespace BSS_WEB.Services
{
    public abstract class BaseApiClient
    {
        private readonly HttpClient _client;
        private readonly ILogger _logger;
        private readonly IHttpContextAccessor _contextAccessor;

        private readonly string _commonErrorMessage = "Internal Server Error";
        protected BaseApiClient(HttpClient client, ILogger logger, IHttpContextAccessor contextAccessor)
        {
            _client = client;
            _logger = logger;
            _contextAccessor = contextAccessor;
        }

       
        protected async Task<T?> SendAsync<T>(HttpMethod method, string apiPath, object? body = null)
        {
            string apiUrl = string.Empty;
            try
            {
                var apiKey = AppConfig.BssApiServiceKey;
                var baseUrl = AppConfig.BssApiServiceBaseUrl;
                apiUrl = string.Format("{0}/{1}", baseUrl, apiPath);
                using var request = new HttpRequestMessage(method, new Uri(apiUrl));

                string? content = string.Empty;
                if (body != null)
                {
                    content = JsonConvert.SerializeObject(body);
                }

                request.Content = new StringContent(content, Encoding.UTF8, "application/json");
                request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
                request.Headers.Add("x-api-key", apiKey);
                // ต้องส่ง user-name + request-id
                string requestId = ShareInfomationHelper.GetSessionTraceIdentifierId(_contextAccessor.HttpContext);
                string userId = ShareInfomationHelper.GetUserId(_contextAccessor.HttpContext);

                request.Headers.Add("x-request-id",requestId);
                request.Headers.Add("x-user-id", userId);


                _logger.LogInformation($"Request:{requestId} {method} {apiUrl}");

                using var response = await _client.SendAsync(request);

                int statusCode = (int) response.StatusCode;
                //var responseMessage = response.ReasonPhrase;
                var responseText = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"API Error {apiUrl} {statusCode}: {responseText}");

                    BaseApiResponse resultError;
                    string businessErrorMessage = GetBusinessErrorMessage(responseText);
                    if (statusCode >=  StatusCodes.Status400BadRequest
                        && !string.IsNullOrEmpty(businessErrorMessage))
                    { 
                        resultError = new BaseApiResponse()
                        {
                            is_success = false,
                            msg_code = statusCode.ToString(),
                            msg_desc = businessErrorMessage
                        };
                    }
                    else
                    {
                        resultError = new BaseApiResponse()
                        {
                            is_success = false,
                            msg_code = AppErrorType.InternalServerError.GetCategory(),
                            msg_desc = AppErrorType.InternalServerError.GetDescription()
                        };
                    }

                    var responseError = JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(resultError));
                    return responseError;
                }

                if (string.IsNullOrWhiteSpace(responseText))
                {
                    var resultError = new BaseApiResponse()

                    {
                        is_success = false,
                        msg_code = statusCode.ToString(),
                        msg_desc = "Content is empty."
                    };
                    var responseError = JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(resultError));
                    return responseError;
                }

                return JsonConvert.DeserializeObject<T>(responseText);
            }
            catch (Exception ex)
            {
                string errorMsg = $"{AppErrorType.InternalServiceUnavailable.GetDescription()} : {ex.GetErrorMessage()}";
                _logger.LogError(ex, $"Failed calling API: {method} {apiUrl} {errorMsg}");
                var resultException = new BaseApiResponse()
                {
                    is_success = false,
                    msg_code = AppErrorType.InternalServiceUnavailable.GetCategory(),
                    msg_desc = errorMsg
                };

                var responseException = JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(resultException));
                return responseException;
            }
        }

        private string GetBusinessErrorMessage(string responseText)
        { 
            try
            {
                var json = JObject.Parse(responseText);

                // 1. custom BusinessException format
                var message = json["msg_desc"]?.ToString();
                if (!string.IsNullOrWhiteSpace(message))
                {
                    return message;
                }      
            }
            catch
            {                 
            }

            return string.Empty;
        }


        /*
       protected T? SendRequest<T>(HttpMethod method, string apiPath, object? body = null)
       {
           string apiUrl = string.Empty;
           try
           {
               var apiKey = AppConfig.BssApiServiceKey;
               var baseUrl = AppConfig.BssApiServiceBaseUrl;
               apiUrl = string.Format("{0}/{1}", baseUrl, apiPath);
               using var request = new HttpRequestMessage(method, new Uri(apiUrl));

               string? content = string.Empty;
               if (body != null)
               {
                   content = JsonConvert.SerializeObject(body);
               }

               request.Content = new StringContent(content, Encoding.UTF8, "application/json");
               request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
               request.Headers.Add("x-api-key", apiKey);
               // ต้องส่ง user-name + request-id
               request.Headers.Add("x-request-id", _share.SessionID);
               request.Headers.Add("x-user-id", _share.UserID.ToString());


               _logger.LogInformation($"Calling: {method} {apiUrl}");

               using var response =  _client.Send(request);

               var responseCode = ((int)response.StatusCode).ToString();
               var responseMessage = response.ReasonPhrase;
               var responseText = response.Content.ReadAsStringAsync().Result;

               if (!response.IsSuccessStatusCode)
               {
                   _logger.LogWarning($"API Error {responseCode}: {responseMessage}");
                   BaseApiResponse resultError;
                   if (responseCode == StatusCodes.Status400BadRequest.ToString())
                   {
                       //try get business exception message
                       resultError = new BaseApiResponse()
                       {
                           is_success = false,
                           msg_code = responseCode,
                           msg_desc = GetBusinessErrorMessage(responseText)?? (response.ReasonPhrase ??"")
                       };
                   }
                   else {
                       resultError = new BaseApiResponse()
                       {
                           is_success = false,
                           msg_code = responseCode,
                           msg_desc = response.ReasonPhrase ?? ""
                       };
                   }


                   var responseError = JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(resultError));
                   return responseError;
               }

               if (string.IsNullOrWhiteSpace(responseText))
               {
                   var resultError = new BaseApiResponse()

                   {
                       is_success = false,
                       msg_code = responseCode,
                       msg_desc = "Content is empty."
                   };
                   var responseError = JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(resultError));
                   return responseError;
               }

               return JsonConvert.DeserializeObject<T>(responseText);
           }
           catch (Exception ex)
           {
               _logger.LogError(ex, $"Failed calling API: {method} {apiUrl}");
               var resultException = new BaseApiResponse()
               {
                   is_success = false,
                   msg_code = AppErrorType.InternalServiceUnavailable.GetCategory(),
                   msg_desc = ex.GetErrorMessage()
               };
               var responseException = JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(resultException));
               return responseException;
           }
       }
       */
    }
}
