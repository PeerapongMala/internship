namespace BSS_API.Models.ObjectModels
{
    public class UserCompanyDepartmentInfoData
    {
        public int DepartmentId { get; set; }
        public string? DepartmentCode { get; set; }
        public string? DepartmentShortName { get; set; } 
        public string? DepartmentName { get; set; }
        public string? CbBcdCode { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyCode { get; set; }
        public string? CompanyName { get; set; }
        public bool? IsSendUnsortCc { get; set; }
        public bool? IsPrepareCentral { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
    }
}
