namespace BSS_API.Models.RequestModels
{
    public class MasterCompanyInstitutionViewData
    {
        public int CompanyInstId { get; set; }
        public int CompanyId { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public int InstId { get; set; }
        public string InstitutionCode { get; set; }        
        public string InstitutionNameEn { get; set; }
        public string InstitutionNameTh { get; set; }
        public string CbBcdCode { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
