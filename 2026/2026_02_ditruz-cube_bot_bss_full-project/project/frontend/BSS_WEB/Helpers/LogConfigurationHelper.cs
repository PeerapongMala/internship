using BSS_WEB.Helpers;
using Serilog;
using Serilog.Core;
using Serilog.Debugging;
using Serilog.Events;

namespace BBSS_WEB.Helpers
{
    public static class LogConfigurationHelper
    {
        private const long DefaultFileSizeLimit = 5 * 1024 * 1024; // 5 MB

        public static Serilog.ILogger CreateAppLogger() =>
            CreateLogger(
                logType: AppConfig.AppLogOutputType,
                logFilePath: AppConfig.AppLogFilePath,
                logMinLevel: AppConfig.AppLogMinLevel,
                rollingInterval: AppConfig.AppLogRollingInterval,
                fileSizeLimit: AppConfig.AppLogFileSize,
                outputTemplate: AppConfig.AppLogFormat,
                enrichProperties: new Dictionary<string, object>
                {
                    { "AppName", AppConfig.AppName },
                    { "Environment", AppConfig.Environment }
                }

                );
         
        private static Serilog.ILogger CreateLogger(
            string logType,
            string logFilePath,
            string logMinLevel,
            string rollingInterval,
            string fileSizeLimit,
            string outputTemplate,
            IDictionary<string, object>? enrichProperties = null
        )
        {

            // Enable internal Serilog diagnostics
            SelfLog.Enable(msg => Console.Error.WriteLine("[Serilog Internal Error] " + msg));

            // Parse log level
            var minLevel = logMinLevel?.ToLower() switch
            {
                "verbose" => LogEventLevel.Verbose,
                "debug" => LogEventLevel.Debug,
                "information" => LogEventLevel.Information,
                "warning" => LogEventLevel.Warning,
                "error" => LogEventLevel.Error,
                "fatal" => LogEventLevel.Fatal,
                _ => LogEventLevel.Information
            };

            // Parse rolling interval
            var ri = rollingInterval?.ToLower() switch
            {
                "year" => RollingInterval.Year,
                "month" => RollingInterval.Month,
                "day" => RollingInterval.Day,
                "hour" => RollingInterval.Hour,
                "minute" => RollingInterval.Minute,
                _ => RollingInterval.Day
            };

            var config = new LoggerConfiguration()
                .MinimumLevel.Is(minLevel)
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext();

            if (enrichProperties != null)
            {
                foreach (var kv in enrichProperties)
                {
                    config.Enrich.WithProperty(kv.Key, kv.Value);
                }
            }

            // Determine sink
            switch (logType?.ToLower())
            {
                case "none":
                    config.WriteTo.Sink(new NoOpSink()); // disables logging
                    break;

                case "file":
                    long? fileSizeLimitBytes = ParseFileSize(fileSizeLimit);
                     
                    config.WriteTo.File(
                        logFilePath,
                        rollingInterval: ri,
                        retainedFileCountLimit: null,  // keep all log files
                        fileSizeLimitBytes: fileSizeLimitBytes ?? DefaultFileSizeLimit,
                        rollOnFileSizeLimit: true,
                        outputTemplate: outputTemplate,
                        shared: true,
                        flushToDiskInterval: TimeSpan.FromSeconds(1) // <-- added (improves resilience)
                    );  

                    //Asynch
                    /*
                    config.WriteTo.Async(a => a.File(
                        logFilePath,
                        rollingInterval: ri,
                        retainedFileCountLimit: null,  // keep all log files
                        fileSizeLimitBytes: fileSizeLimitBytes ?? DefaultFileSizeLimit,
                        rollOnFileSizeLimit: true,
                        outputTemplate: outputTemplate,
                        shared: true,
                        flushToDiskInterval: TimeSpan.FromSeconds(1) // improves resilience
                    ));
                    */
                    break;

                case "console":
                default:
                    
                    config.WriteTo.Console(
                        outputTemplate: outputTemplate
                    );
                    /*
                    config.WriteTo.Async(a => a.Console(
                        outputTemplate: outputTemplate
                    ));
                    */
                    break;
            }

            return config.CreateLogger();
        }

        /// <summary>
        /// Parse file size from string (e.g., "5MB", "1048576") to bytes.
        /// Defaults to 5 MB if invalid.
        /// </summary>
        private static long ParseFileSize(string? sizeStr)
        {
            if (string.IsNullOrWhiteSpace(sizeStr))
                return DefaultFileSizeLimit;

            sizeStr = sizeStr.Trim().ToUpper();
            if (sizeStr.EndsWith("MB") && long.TryParse(sizeStr[..^2], out var mb))
                return mb * 1024 * 1024;

            if (long.TryParse(sizeStr, out var bytes))
                return bytes;

            return DefaultFileSizeLimit;
        }
    }

    public class NoOpSink : ILogEventSink
    {
        public void Emit(LogEvent logEvent)
        {
            // Do nothing
        }
    }

    // Retry wrapper sink
    public class RetrySink : ILogEventSink
    {
        private readonly ILogEventSink _innerSink;
        private readonly int _retryCount;
        private readonly int _retryDelayMs;

        public RetrySink(ILogEventSink innerSink, int retryCount = 3, int retryDelayMs = 200)
        {
            _innerSink = innerSink;
            _retryCount = retryCount;
            _retryDelayMs = retryDelayMs;
        }

        public void Emit(LogEvent logEvent)
        {
            for (int attempt = 1; attempt <= _retryCount; attempt++)
            {
                try
                {
                    _innerSink.Emit(logEvent);
                    return; // success
                }
                catch (Exception ex)
                {
                    if (attempt == _retryCount)
                        SelfLog.WriteLine($"[RetrySink] Failed after {attempt} attempts: {ex.Message}");
                    else
                        Thread.Sleep(_retryDelayMs);
                }
            }
        }
    }
}
