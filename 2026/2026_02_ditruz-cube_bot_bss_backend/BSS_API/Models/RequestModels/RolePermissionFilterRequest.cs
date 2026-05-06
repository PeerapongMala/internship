namespace BSS_API.Models.RequestModels
{
    public class RolePermissionFilterRequest
    {
        public string RoleFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
