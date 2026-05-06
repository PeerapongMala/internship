namespace BSS_API.Models.RequestModels
{
    public class RoleFilterRequest
    {
        public string RoleGroupFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
