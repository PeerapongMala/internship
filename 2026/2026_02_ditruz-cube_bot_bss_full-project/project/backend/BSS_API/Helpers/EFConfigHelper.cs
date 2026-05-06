namespace BSS_API.Helpers
{
    using Microsoft.EntityFrameworkCore;

    public static class EFConfigHelper
    {
        public static void ConfigureSqlServer(
            DbContextOptionsBuilder options,
            string connectionString)
        {
            bool enableRetry = AppConfig.EFRetryEnable();
            int maxRetryCount = AppConfig.EFRetryMax();
            int maxRetryDelaySeconds = AppConfig.EFRetryDelaySecond();

            options.UseSqlServer(connectionString, sql =>
            {
                if (enableRetry)
                {
                    sql.EnableRetryOnFailure(
                        maxRetryCount: maxRetryCount,
                        maxRetryDelay: TimeSpan.FromSeconds(maxRetryDelaySeconds),
                        errorNumbersToAdd: null
                    );
                }
            });
        }
    }
}