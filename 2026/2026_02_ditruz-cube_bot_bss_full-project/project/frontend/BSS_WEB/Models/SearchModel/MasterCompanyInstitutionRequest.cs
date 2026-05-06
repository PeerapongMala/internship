namespace BSS_API.Models.RequestModels
{
    public class MasterCompanyInstitutionRequest
    {
        public int? CompanyInstId { get; set; }
        public int? CompanyId { get; set; }
        public int? InstId { get; set; }
        public bool? IsActive { get; set; }
    }
}