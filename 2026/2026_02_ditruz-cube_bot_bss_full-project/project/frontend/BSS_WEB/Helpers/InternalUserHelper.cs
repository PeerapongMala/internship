namespace BSS_WEB.Helpers
{
    public static class InternalUserHelper
    {
        public static string GetUserName(HttpContext? context)
        {
            if(context == null)
                return string.Empty;

            if (context?.User?.Identity?.IsAuthenticated != true)
                return string.Empty;

            if (string.IsNullOrWhiteSpace(context.User.Identity.Name ?? ""))
                return string.Empty;

            return ExtractUserName(context?.User.Identity?.Name);
        }

        public static string ExtractUserName(string? inputUserName)
        {
            if(string.IsNullOrWhiteSpace(inputUserName))
                return string.Empty;

            // Case 1: DOMAIN\username
            if (inputUserName.Contains("\\"))
            {
                var parts = inputUserName.Split('\\');
                return parts.Length > 1 ? parts[1] : parts[0];
            }

            // Case 2: username@domain
            if (inputUserName.Contains("@"))
            {
                var parts = inputUserName.Split('@');
                return parts[0];
            }

            // Default: already just username
            return inputUserName;
        }
    }
}
