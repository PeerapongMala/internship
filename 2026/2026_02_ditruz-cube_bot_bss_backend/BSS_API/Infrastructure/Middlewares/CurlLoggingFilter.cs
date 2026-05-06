using BSS_API.Helpers;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using Serilog.Events;
using System.Text;

namespace BSS_API.Infrastructure.Middlewares
{
    public interface ICurlLogger
    {
        void Log(string curlCommand);
    }

    public class CurlLoggerWrapper : ICurlLogger
    {
        private readonly Serilog.ILogger _inner;

        public CurlLoggerWrapper()
        {
            _inner = LogConfigurationHelper.CreateTxnLogger();
        }

        public void Log(string curlCommand)
        {
            try
            {
                _inner.Write(LogEventLevel.Information, "{Message:l}", curlCommand);
            }
            catch (Exception ex)
            {
                // Will write to SelfLog (console by default)
                Serilog.Debugging.SelfLog.WriteLine($"[CurlLoggerWrapper] Logging failed: {ex.Message}");
            }
        }
    }

    public class CurlLoggingFilter : IActionFilter
    {
        private readonly ICurlLogger _curlLogger;
        private readonly IHttpContextAccessor _contextAccessor;

        private static readonly string[] NecessaryHeaders = new[]
            { "Content-Type", "x-api-key", "x-request-id", "x-user-id" };

        public CurlLoggingFilter(ICurlLogger curlLogger, IHttpContextAccessor contextAccessor)
        {
            _curlLogger = curlLogger;
            _contextAccessor = contextAccessor;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Store the cURL command in HttpContext.Items so it can be reused in OnActionExecuted
            var request = context.HttpContext.Request;
            var sb = new StringBuilder();

            sb.Append("curl");
            if (request.Scheme.Equals("https", StringComparison.OrdinalIgnoreCase))
                sb.Append(" -k");

            sb.Append(" -X ").Append(request.Method).Append(" ");

            foreach (var header in request.Headers)
            {
                if (!NecessaryHeaders.Contains(header.Key, StringComparer.OrdinalIgnoreCase))
                    continue;

                var value = header.Value.ToString().Replace("\"", "\\\"");
                sb.Append($"-H \"{header.Key}: {value}\" ");
            }

            if (request.ContentLength > 0 &&
                (request.Method == "POST" || request.Method == "PUT" || request.Method == "PATCH"))
            {
                request.EnableBuffering();
                request.Body.Position = 0;
                using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
                var body = reader.ReadToEnd();
                request.Body.Position = 0;

                if (!string.IsNullOrWhiteSpace(body))
                {
                    var escapedBody = body.Replace("\r", "")
                        .Replace("\n", "")
                        .Replace("'", "'\"'\"'");
                    sb.Append($"-d '{escapedBody}' ");
                }
            }

            //var url = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
            var url = $"{request.Scheme}://{request.Host}{request.PathBase}{request.Path}{request.QueryString}";
            sb.Append($"\"{url}\"");

            context.HttpContext.Items["CurlCommand"] = sb.ToString();
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            var request = context.HttpContext.Request;
            var curl = context.HttpContext.Items["CurlCommand"] as string ?? "curl <unknown>";
            var traceId = RequestContextHelper.GetRequestId();
            var timestamp = DateTimeOffset.Now.ToString("yyyy-MM-dd HH:mm:ss.fff zzz");

            string logText;

            if (context.Exception == null)
            {
                // SUCCESS CASE
                var statusCode = context.HttpContext.Response.StatusCode;
                logText =
                    $@"# SUCCESS {statusCode} at {timestamp} | TraceId: {traceId}
{curl}

";
            }
            else
            {
                // ERROR CASE — comment out the curl
                var exception = context.Exception.GetType().Name;
                logText =
                    $@"# ERROR ({exception}) at {timestamp} | TraceId: {traceId}
# To replay this request, uncomment the line below
# {curl.Replace("\n", "\n# ")} 

";
            }

            _curlLogger.Log(logText);
        }
    }
}