using BSS_WEB.Models.ServiceModel;
using System.ComponentModel;
using System.Globalization;

namespace BSS_WEB.Helpers
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
            return data == null ? 0 : Convert.ToInt32(data); ;
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
        public static string GetErrorMessage(this Exception ex)
        {
            if (ex.InnerException == null)
            {
                return ex.Message;
            }
            else
            {
                return $"{ex.InnerException.Message}";
            }
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
        public static void SetResponseApiSuccessOther(this BaseApiResponse response, string reponseCode, string? reponseMessage = null, string? reponseContent = null)
        {
            response.is_success = true;
            response.msg_code = reponseCode;
            response.msg_desc = reponseContent ?? (reponseMessage ?? string.Empty);
        }
        public static void SetResponseApiError(this BaseApiResponse response, string reponseCode, string? reponseMessage = null)
        {
            response.is_success = false;
            response.msg_code = reponseCode;
            response.msg_desc = reponseMessage ?? AppErrorType.InternalServerError.GetDescription();
        }
        public static void SetResponseServiceException(this BaseApiResponse response, string? customErrorMessage = null)
        {
            response.is_success = false;
            response.msg_code = AppErrorType.InternalServiceUnavailable.GetCategory();
            response.msg_desc = customErrorMessage ?? AppErrorType.InternalServiceUnavailable.GetDescription();
        }
        public static string SetApiServiceLogMessage(string? sessionID = null, string? requestBody = null, string? responseBody = null)
        {
            string message = $"Request Service:{requestBody}{Environment.NewLine}\tResponse Service:{responseBody}";
            string logMessage = $"{sessionID}\t{message}";
            return logMessage;
        }
        public static string SetApiServiceLogErrorMessage(string? sessionID = null, string? ErrorMessage = null)
        {
            string message = $"ResponseCode:{AppErrorType.InternalServiceUnavailable.GetCategory()} Error:{ErrorMessage}";
            string logMessage = $"{sessionID}\t{message}";
            return logMessage;
        }
    }
}
