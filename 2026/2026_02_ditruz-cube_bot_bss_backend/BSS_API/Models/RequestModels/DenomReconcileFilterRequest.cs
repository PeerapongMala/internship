namespace BSS_API.Models.RequestModels
{
    public class DenomReconcileFilterRequest
    {
        public string DepartmentFilter { get; set; } = string.Empty;
        public string DenominationFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;

    }
}
