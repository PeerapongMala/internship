namespace BSS_API.Models.RequestModels
{
    public class CashCenterFilterRequest
    {
        public string DepartmentFilter { get; set; } = string.Empty;
        public string InstitutionFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
