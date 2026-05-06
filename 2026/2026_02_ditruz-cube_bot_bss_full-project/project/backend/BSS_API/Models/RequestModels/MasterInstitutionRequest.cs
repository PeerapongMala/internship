namespace BSS_API.Models.RequestModels
{
    public class MasterInstitutionRequest
    {         
        public int? InstitutionId { get; set; }

        public string InstitutionCode { get; set; } = string.Empty;
        public string BankCode { get; set; } = string.Empty;
        
        public bool? IsActive { get; set; }
    }
}
