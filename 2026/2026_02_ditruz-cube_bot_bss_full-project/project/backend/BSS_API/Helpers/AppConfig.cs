namespace BSS_API.Helpers
{
    public static class AppConfig
    {
        public static string AppName
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.APP_NAME");
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

        public static string PathBase
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.PATH_BASE");
                return value;
            }
        }

        public static string TestConfig
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.TEST");
                return value;
            }
        }

        public static string DbConnectionString
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.DB_CONNECTION");
                return value;
            }
        }


        public static string DbCommandTimeout
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.DB_COMMAND_TIMEOUT");
                return value;
            }
        }

        public static string SystemCode
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.SYSTEM_CODE");
                return value;
            }
        }

        public static string SystemName
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.SYSTEM_NAME");
                return value;
            }
        }

        public static string PrivateKey
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.PRIVATE_KEY");
                return value;
            }
        }

        public static string LoadTestFlag
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOAD_TEST_FLAG");
                return value;
            }
        }

        public static string IsMockFlag
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.IS_MOCK_FLAG");
                return value;
            }
        }

        public static string XApiKey(string systemCode)
        {
            string value = GetConfigurationValue($"BSS.API.X_API_KEY.{systemCode}");
            return value;
        }

        public static string JwtValidIssuer
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.JWT_VALID_ISSUER");
                return value;
            }
        }

        public static string JwtValidAudience
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.JWT_VALID_AUDIENCE");
                return value;
            }
        }

        public static string JwtIssuerSigningKey
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.JWT_ISSUER_SIGNING_KEY");
                return value;
            }
        }

        public static string JwtExpiryMinutes
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.JWT_EXPIRY_MINUTES");
                return value;
            }
        }

        public static string AppLogOutputType
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.APP.OUTPUT_TYPE");
                return value;
            }
        }

        public static string AppLogFilePath
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.APP.FILE_PATH");
                return value;
            }
        }

        public static string AppLogMinLevel
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.APP.MIN_LEVEL");
                return value;
            }
        }

        public static string AppLogFileSize
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.APP.FILE_SIZE");
                return value;
            }
        }

        public static string AppLogFormat
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.APP.LOG_FORMAT");
                return value;
            }
        }

        public static string AppLogRollingInterval
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.APP.ROLLING_INTERVAL");
                return value;
            }
        }

        public static string TxnLogOutputType
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.TXN.OUTPUT_TYPE");
                return value;
            }
        }

        public static string TxnLogFilePath
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.TXN.FILE_PATH");

                return value;
            }
        }

        public static string TxnLogRollingInterval
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.TXN.ROLLING_INTERVAL");
                return value;
            }
        }

        public static string TxnLogFileSize
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.TXN.FILE_SIZE");
                return value;
            }
        }


        public static string EFLogOutputType
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.EF.OUTPUT_TYPE");
                return value;
            }
        }

        public static string EFLogFilePath
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.EF.FILE_PATH");

                return value;
            }
        }

        public static string EFLogRollingInterval
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.EF.ROLLING_INTERVAL");
                return value;
            }
        }

        public static string EFLogFileSize
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.LOG.EF.FILE_SIZE");
                return value;
            }
        }

        public static string BotAdBaseUrl
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AD_WS_BASE_URL");
                return value;
            }
        }

        public static string BotADGetUserByLogonName
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AD_WS_GET_BY_LOGON_NAME");
                return value;
            }
        }

        public static string BotADGetUsersByDepartment
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AD_WS_GET_BY_DEPARTMENT");
                return value;
            }
        }

        public static string BotADGetUsersByGuid
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AD_WS_GET_BY_GUID");
                return value;
            }
        }

        public static string BotADGetUsersByDisplayNameAndDepartments
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AD_WS_GET_BY_DISPLAY_NAME");
                return value;
            }
        }

        public static string BotADGetAllInOUAccountByDisplayNames
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AD_WS_GET_ALL_BY_DISPLAY_NAME");
                return value;
            }
        }


        public static string BotAuthenBaseUrl
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_BASE_URL");
                return value;
            }
        }

        public static string BotAuthenGetActivePersonByCert
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_GET_ACTIVE_PERSON_BY_CERT");
                return value;
            }
        }

        public static string BotAuthenGetPersonListBySearchName
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_GET_PERSON_BY_SEARCH_NAME");
                return value;
            }
        }

        public static string BotAuthenGetPersonListByRegID
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_GET_PERSON_BY_REGID");
                return value;
            }
        }

        public static string BotAuthenGetActivePersonListByInst
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_GET_ACTIVE_PERSON_BY_INST");
                return value;
            }
        }

        public static string BotAuthenGetCertificateByRegID
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_GET_CERTIFICATE_BY_REGID");
                return value;
            }
        }

        public static string BotAuthenCheckCRLValidCert
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.BOT_AUTHEN_CHECK_CRL_VALID_CERT");
                return value;
            }
        }

        public static string RefreshTokenExpiryDays
        {
            get
            {
                string value = GetConfigurationValue("BSS.API.REFRESH_TOKEN_EXPIRY_DAYS");
                return value;
            }
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


        public static int GetCacheExpirationMinute(string dataKey)
        {
            var value = GetConfigurationValue($"BSS.API.CACHE.{dataKey}.EXP.MINUTE", required: false);
            if (int.TryParse(value, out int minutes))
                return minutes;

            int defaultExpMinute = 30;
            string configDefaultValueMinute = GetConfigurationValue("BSS.API.CACHE.DEFAULT.EXP.MINUTE");
            if (int.TryParse(value, out int configDefaultValue))
                return configDefaultValue;

            return defaultExpMinute;
        }

        public static bool EFRetryEnable()
        {
            var value = GetConfigurationValue("BSS.API.EF_RETRY_ENABLE");
            if (value == "Y")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #region FtpConfiguration

        public static string FtpHost
        {
            get
            {
                string value = GetConfigurationValue("BSS.FTP.HOST");
                return value;
            }
        }

        public static int FtpPort
        {
            get
            {
                string value = GetConfigurationValue("BSS.FTP.PORT");
                return int.Parse(value);
            }
        }

        public static string FtpUser
        {
            get
            {
                string value = GetConfigurationValue("BSS.FTP.USER");
                return value;
            }
        }

        public static string FtpPassword
        {
            get
            {
                string value = GetConfigurationValue("BSS.FTP.PASSWORD");
                return value;
            }
        }

        public static string FtpSuccessFolder
        {
            get
            {
                string value = GetConfigurationValue("BSS.FTP.SUCCESS_FOLDER", required: false);
                return string.IsNullOrEmpty(value) ? "success" : value;
            }
        }

        public static string FtpErrorFolder
        {
            get
            {
                string value = GetConfigurationValue("BSS.FTP.ERROR_FOLDER", required: false);
                return string.IsNullOrEmpty(value) ? "error" : value;
            }
        }

        #endregion FtpConfiguration

        #region MailSMTPConfiguration

        public static string BssSmtpHost
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_HOST");
                return value;
            }
        }

        public static int BssSmtpPort
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_PORT");
                return Int32.Parse(value);
            }
        }

        public static string BssSmtpUser
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_USER");
                return value;
            }
        }

        public static string BssSmtpPassword
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_PASSWORD");
                return value;
            }
        }

        public static bool BssSmtpUseTls
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_USE_TLS");
                return bool.Parse(value);
            }
        }

        public static int BssSmtpOtpExpire
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_OTP_EXPIRE");
                return int.Parse(value);
            }
        }

        public static bool BssSmtpIgnoreValidateCert
        {
            get
            {
                string value = GetConfigurationValue("BSS.MAIL.SMTP_IGNORE_VALIDATE_CERT");
                return bool.Parse(value);
            }
        }

        #endregion MailSMTPConfiguration

        public static int EFRetryMax()
        {
            var value = GetConfigurationValue("BSS.API.EF_RETRY_MAX");
            return int.TryParse(value, out var result) ? result : 5;
        }

        public static int EFRetryDelaySecond()
        {
            var value = GetConfigurationValue("BSS.API.EF_RETRY_DELAY_SEC");
            return int.TryParse(value, out var result) ? result : 10;
        }

        private static string GetConfigurationValue(string keyName, bool required = true)
        {
            var value = System.Environment.GetEnvironmentVariable(keyName);
            if (value == null && required)
            {
                throw new InvalidOperationException($"Configuration {keyName} is missing");
            }

            return value ?? "";
        }
    }
}