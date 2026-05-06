namespace BSS_API.Models.RequestModels
{
    public class MasterCompanyDepartmentRequest
    {
        public int? ComdeptId { get; set; }
        public int? CompanyId { get; set; }
        public int? DepartmentId { get; set; }
        public string CbBcdCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
        public bool? IsSendUnsortCC { get; set; }
        public bool? IsPrepareCentral { get; set; }
    }
}