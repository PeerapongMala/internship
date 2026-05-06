using BSS_WEB.Models;
using Serilog;


namespace BSS_WEB.Helpers
{
   public static class LoggerManagerHelper
    {
        private static readonly Serilog.ILogger _log = Log.ForContext(typeof(LoggerManagerHelper));

        public static void Error(object message)
        {
            _log.Error($"{message}");
        }
        public static void Error(Exception ex)
        {
            _log.Error(ex.Message, ex);
        }
        public static void Error(object message, Exception ex)
        {
            _log.Error($"{message}", ex);
        }

        public static void Error(AppLogger appLogger)
        {
            string message = string.Format("Code: {0}\n Page: {1}\n API: {2}\n Status: {3}\n Description: {4}\n IPAddress: {5}"
                , appLogger.LogCode, appLogger.LogPage, appLogger.LogApi, appLogger.LogStatus, appLogger.Description, appLogger.IPAddress);

            _log.Error(message);
        }

        public static void Error(AppLogger appLogger, Exception ex)
        {
            string message = string.Format("Code: {0}\n Page: {1}\n API: {2}\n Status: {3}\n Description: {4}\n IPAddress: {5}"
                , appLogger.LogCode, appLogger.LogPage, appLogger.LogApi, appLogger.LogStatus, appLogger.Description, appLogger.IPAddress);
            
            _log.Error(message, ex);
        }

        public static void Info(object message)
        {
            _log.Information($"{message}");
        }
        public static void Info(AppLogger appLogger)
        {
            string message = string.Format("Code: {0}\n Page: {1}\n API: {2}\n Status: {3}\n Description: {4}\n IPAddress: {5}"
                , appLogger.LogCode, appLogger.LogPage, appLogger.LogApi, appLogger.LogStatus, appLogger.Description, appLogger.IPAddress);
            
            _log.Information(message);
        }
        public static void Warn(object message)
        {
            _log.Warning($"{message}");
        }
        public static void Warn(AppLogger appLogger)
        {
            string message = string.Format("Code: {0}\n Page: {1}\n API: {2}\n Status: {3}\n Description: {4}\n IPAddress: {5}"
                , appLogger.LogCode, appLogger.LogPage, appLogger.LogApi, appLogger.LogStatus, appLogger.Description, appLogger.IPAddress);
            
            _log.Warning(message);
        }
    }
}
