using BSS_API.Models.ObjectModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Models.ServiceModels;
using System.Net.Http;
using Newtonsoft.Json;
using System.ComponentModel;
using System.Globalization;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;


namespace BSS_API.Helpers
{
    public static class AppExtension
    {
        public static string AsString(this object data, string format = "", bool isBuddhaDate = false)
        {
            var result = Convert.ToString(data);
            if (!string.IsNullOrEmpty(result))
            {
                if (data.GetType() == typeof(DateTime))
                {
                    if (string.IsNullOrEmpty(format)) format = "dd/MM/yyyy";
                    if (isBuddhaDate)
                        result = string.Format(new CultureInfo("th-TH", false), "{0:" + format + "}", data);
                    else
                        result = string.Format(new CultureInfo("en-US", false), "{0:" + format + "}", data);
                }
                else if (!string.IsNullOrEmpty(format) &&
                         (data.GetType() == typeof(short) ||
                          data.GetType() == typeof(ushort) ||
                          data.GetType() == typeof(int) ||
                          data.GetType() == typeof(uint) ||
                          data.GetType() == typeof(float) ||
                          data.GetType() == typeof(double) ||
                          data.GetType() == typeof(decimal) ||
                          data.GetType() == typeof(long) ||
                          data.GetType() == typeof(ulong)))
                {
                    result = string.Format("{0:" + format + "}", data);
                }
            }

            return result;
        }

        public static int AsInt(this object data)
        {
            return Convert.ToInt32(data);
        }
        public static int? AsIntNull(this object data)
        {
            return data == null ? (int?)null : Convert.ToInt32(data);
        }
        public static double AsDouble(this object data)
        {
            return Convert.ToDouble(data);
        }
        public static Nullable<double> AsDoubleNull(this object data)
        {
            return data == null ? (Nullable<double>)null : Convert.ToDouble(data);
        }
        public static decimal AsDecimal(this object data)
        {
            return Convert.ToDecimal(data);
        }
        public static Nullable<decimal> AsDecimalNull(this object data)
        {
            return data == null ? (Nullable<decimal>)null : Convert.ToDecimal(data);
        }

        public static DateTime AsDateTime(this string data, string format = "dd/MM/yyyy", bool isBuddha = false)
        {
            var date = DateTime.MinValue;
            if (!string.IsNullOrEmpty(data))
            {
                try
                {
                    if (isBuddha)
                    {
                        if (DateTime.TryParseExact(data, format, new CultureInfo("en-US"), DateTimeStyles.None, out var dateBuddha))
                        {
                            var startY = format.IndexOf('y');
                            var endY = format.LastIndexOf('y');
                            var y = data.Substring(format.IndexOf('y'), ((endY - startY) + 1));
                            var year = dateBuddha.Year;
                            if (year == Convert.ToInt32(y))
                            {
                                year = dateBuddha.Year - 543;
                                if (year < 1754)
                                {
                                    throw new Exception($"Invalid datetime format(year:{year}).");
                                }
                            }
                            date = DateTime.ParseExact($"{year}{dateBuddha:MMdd}", "yyyyMMdd", CultureInfo.InvariantCulture);
                        }
                    }
                    else
                    {
                        date = DateTime.ParseExact(data, format, new CultureInfo("en-US"));
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
            return date;
        }

        public static DateTime AsDateTime(this DateTime? data)
        {
            var date = DateTime.MinValue;
            if (data != null && data.HasValue)
            {
                date = data.Value;
            }
            return date;
        }

        public static Nullable<DateTime> AsDateTimeNull(this string data, string format = "dd/MM/yyyy", bool isBuddha = false)
        {
            var date = (Nullable<DateTime>)null;
            if (!string.IsNullOrEmpty(data))
            {
                try
                {
                    if (isBuddha)
                    {
                        if (DateTime.TryParseExact(data, format, new CultureInfo("en-US"), DateTimeStyles.None, out var dateBuddha))
                        {
                            var startY = format.IndexOf('y');
                            var endY = format.LastIndexOf('y');
                            var y = data.Substring(format.IndexOf('y'), ((endY - startY) + 1));
                            var year = dateBuddha.Year;
                            if (year == Convert.ToInt32(y))
                            {
                                year = dateBuddha.Year - 543;
                                if (year < 1754)
                                {
                                    throw new Exception($"Invalid datetime format(year:{year}).");
                                }
                            }
                            date = DateTime.ParseExact($"{year}{dateBuddha:MMdd}", "yyyyMMdd", CultureInfo.InvariantCulture);
                        }
                    }
                    else
                    {
                        date = DateTime.ParseExact(data, format, new CultureInfo("en-US"));
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
            return date;
        }

        public static string GetDescription(this Enum e)
        {
            Type type = e.GetType();
            var memInfo = type.GetMember(e.ToString());
            var descriptionAttribute = memInfo[0]
                .GetCustomAttributes(typeof(DescriptionAttribute), false)
                .FirstOrDefault() as DescriptionAttribute;

            if (descriptionAttribute != null)
            {
                return descriptionAttribute.Description;
            }
            return string.Empty; // could also return string.Empty
        }

        public static string GetCategory(this Enum e)
        {
            var type = e.GetType();
            var memInfo = type.GetMember(e.ToString());
            var categoryAttribute = memInfo[0]
                .GetCustomAttributes(typeof(CategoryAttribute), false)
                .FirstOrDefault() as CategoryAttribute;

            if (categoryAttribute != null)
            {
                return categoryAttribute.Category;
            }
            return string.Empty; // could also return string.Empty
        }

        public static string GetErrorMessage(this Exception ex)
        {
            if (ex.InnerException == null)
            {
                return ex.Message;
            }
            else
            {
                return $"{ex.Message} >>> {GetErrorMessage(ex.InnerException)}";
            }
        }

        public static ErrorResponse GetErrorResponse(this AppErrorType errorType, string code, string message = "", string typeDescription = "", string parameter = "", [CallerMemberName] string callerName = null, [CallerLineNumber] int callerLineNo = 0)
        {
            return new ErrorResponse
            {
                is_success = false,
                msg_code = code,
                msg_desc = string.IsNullOrEmpty(message) ? errorType.GetDescription() : message,
            };
        }

        public static InvalidInputErrorResponse GetInvalidInputErrorResponse(this AppErrorType errorType, string code, string message = "", string typeDescription = "", string parameter = "", [CallerMemberName] string callerName = null, [CallerLineNumber] int callerLineNo = 0)
        {
            return new InvalidInputErrorResponse
            {
                is_success = false,
                msg_code = code,
                msg_desc = string.IsNullOrEmpty(message) ? errorType.GetDescription() : message,
                parameter_neme = parameter
            };
        }

        public static void SetResponseHeader(this HttpResponse response, string code, string message, string datasource)
        {
            if (response.Headers.ContainsKey("responsecode"))
            {
                response.Headers.Remove("responsecode");
            }

            response.Headers.Add("responsecode", code);

            if (response.Headers.ContainsKey("responsedatasource"))
            {
                response.Headers.Remove("responsedatasource");
            }

            response.Headers.Add("responsedatasource", datasource);

            if (response.Headers.ContainsKey("responsemessage"))
            {
                response.Headers.Remove("responsemessage");
            }

            var responseMessage = Regex.Replace(message, @"[^0-9a-zA-Z:,\s]+", "");
            if (responseMessage.Length > 255)
            {
                responseMessage = responseMessage.Remove(255);
            }

            response.Headers.Add("responsemessage", responseMessage);
        }

        public static bool IgnorePath(this string path)
        {
            var listIgnores = new List<string> {
                "^/?alive.*",
                "^/?swagger.*",
                "^/?favicon\\.ico.*"
            };
            return listIgnores.Any(m => Regex.IsMatch(path, m));
        }

        public static void SetResponseSuccess<TData>(this BaseResponse<TData> response, string? customMessage = null)
        {
            response.is_success = true;
            response.msg_code = AppErrorType.Success.GetCategory();
            response.msg_desc = string.IsNullOrEmpty(customMessage) ? AppErrorType.Success.GetDescription() : customMessage;
        }

        public static void SetResponseDataNotFound<TData>(this BaseResponse<TData> response, string? customMessage = null)
        {
            response.is_success = false;
            response.msg_code = AppErrorType.DataNotFound.GetCategory();
            response.msg_desc = string.IsNullOrEmpty(customMessage) ? AppErrorType.DataNotFound.GetDescription() : customMessage;
        }

        public static void SetResponseInternalServiceError<TData>(this BaseResponse<TData> response, string? customErrorMessage = null)
        {
            response.is_success = false;
            response.msg_code = AppErrorType.InternalServiceError.GetCategory();
            response.msg_desc = string.IsNullOrEmpty(customErrorMessage) ? AppErrorType.InternalServiceError.GetDescription() : customErrorMessage;
        }
    }
}
