namespace BSS_API.Infrastructure.Middlewares
{
    public static class AppBuilderExtensions
    {
        public static IApplicationBuilder UseRequestLog(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestLogMiddleware>();
        }
    }
}
