namespace BSS_API.Models.RequestModels
{
    public class MasterCashCenterRequest
    {
        public int? CashCenterId { get; set; }
        public int? DepartmentId { get; set; }
        public int? InstitutionId { get; set; }

        public string CashCenterCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}
