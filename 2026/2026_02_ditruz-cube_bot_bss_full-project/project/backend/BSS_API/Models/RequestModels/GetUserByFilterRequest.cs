namespace BSS_API.Models.RequestModels
{
    public class GetUserByFilterRequest
    {
        public string CompanyFilter { get; set; } = string.Empty;
        public string DepartmentFilter { get; set; } = string.Empty;
        public string RoleFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
