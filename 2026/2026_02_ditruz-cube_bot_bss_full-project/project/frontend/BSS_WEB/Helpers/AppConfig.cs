namespace BSS_WEB.Helpers
{
    public static class AppConfig
    {
        public static string AppName
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.APP_NAME");
                return value;
            }
        }

        public static string Environment
        {
            get
            {
                string value = GetConfigurationValue("ASPNETCORE_ENVIRONMENT");
                return value;
            }
        }
        private static string GetConfigurationValue(string keyName)
        {
            var value = System.Environment.GetEnvironmentVariable(keyName);
            if (value == null)
            {
                throw new InvalidOperationException($"Configuration {keyName} is missing");
            }
            return value ?? "";
        }
        public static Uri GetUrl(string data)
        {
            var url = new Uri(PathBase);
            if (!string.IsNullOrEmpty(data))
            {
                url = new Uri(url, data);
            }
            return url;
        }

        public static string PathBase
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.PATH_BASE");
                return value;
            }
        }

        public static string SystemCode
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.SYSTEM_CODE");
                return value;
            }
        }

        public static string SystemName
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.SYSTEM_NAME");
                return value;
            }
        }
        public static string PrivateKey
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.PRIVATE_KEY");
                return value;
            }
        }

        public static string TestFlagConfig
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.TEST_FLAG");
                return value;
            }
        }

        public static string BssApiServiceBaseUrl
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.BSS_API_BASE_URL");
                return value;
            }
        }

        public static string BssApiServiceKey
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.BSS_API_KEY");
                return value;
            }
        }

        public static string AppLogOutputType
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.LOG.APP.OUTPUT_TYPE");
                return value;
            }
        }
        public static string AppLogFilePath
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.LOG.APP.FILE_PATH");
                return value;
            }
        }
        public static string AppLogMinLevel
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.LOG.APP.MIN_LEVEL");
                return value;
            }
        }
        public static string AppLogFileSize
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.LOG.APP.FILE_SIZE");
                return value;
            }
        }

        public static string AppLogFormat
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.LOG.APP.LOG_FORMAT");
                return value;
            }
        }

        public static string AppLogRollingInterval
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.LOG.APP.ROLLING_INTERVAL");
                return value;
            }
        }
        public static string SessionTimeout
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.SESSION_TIMEOUT");
                return value;
            }
        }

        public static string IsExternalWeb
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.IS_EXTERNAL_WEB");
                return value;
            }
        }

        public static string JwtIssuerSigningKey
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.JWT_ISSUER_SIGNING_KEY");
                return value;
            }
        }

        public static string JwtValidIssuer
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.JWT_VALID_ISSUER");
                return value;
            }
        }

        public static string JwtValidAudience
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.JWT_VALID_AUDIENCE");
                return value;
            }
        }
        public static string JwtExpiryMinutes
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.JWT_EXPIRY_MINUTES");
                return value;
            }
        }

        public static string IsMockUserAuthen
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.IS_MOCK_USER_AUTHEN");
                return value;
            }
        }

        public static string RefreshTokenExpiryDays
        {
            get
            {
                string value = GetConfigurationValue("BSS.WEB.REFRESH_TOKEN_EXPIRY_DAYS");
                return value;
            }
        }
    }
}
