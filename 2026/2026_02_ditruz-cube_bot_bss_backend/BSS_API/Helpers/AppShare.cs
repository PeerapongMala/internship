using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

namespace BSS_API.Helpers
{
    public interface IAppShare
    {
        void LogInformation(string message);
        void LogDebug(string message);
        void LogWarning(string message);
        void LogError(string message);
    }

    public class AppShare : IAppShare
    {
       
        private readonly Serilog.ILogger _logger;
        public AppShare(Serilog.ILogger logger)
        {
            _logger = logger;
             
        }

        public void LogDebug(string message)
        {
            _logger.Debug(message);
        }

        public void LogError(string message)
        {
            _logger.Error(message);
        }

        public void LogInformation(string message)
        {
            _logger.Information(message);
        }

        public void LogWarning(string message)
        {
            _logger.Warning(message);
        }

        
         

         
    }
}
