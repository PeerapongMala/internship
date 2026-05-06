namespace BSS_WEB.Helpers
{
    public static class HttpContextExtensions
    {
        public static string? GetClientIpAddress(this HttpContext context)
        {
            return context.Connection.RemoteIpAddress?.ToString();
        }
    }
}
