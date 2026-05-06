namespace BSS_API.Models.RequestModels
{
    public class MasterCashPointRequest
    {
        public int? CashpointId { get; set; }
        public int? InstitutionId { get; set; }
        public int? DepartmentId { get; set; }
        public string BranchCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}
