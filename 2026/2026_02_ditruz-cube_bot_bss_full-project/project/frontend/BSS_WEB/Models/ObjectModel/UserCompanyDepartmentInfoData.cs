namespace BSS_WEB.Models.ObjectModel
{
    public class UserCompanyDepartmentInfoData
    {
        public int departmentId { get; set; }
        public string? departmentCode { get; set; }
        public string? departmentShortName { get; set; }
        public string? departmentName { get; set; }
        public string? cbBcdCode { get; set; }
        public int? companyId { get; set; }
        public string? companyCode { get; set; }
        public string? companyName { get; set; }
        public bool? isSendUnsortCc { get; set; }
        public bool? isPrepareCentral { get; set; }
        public string? startDate { get; set; }
        public string? endDate { get; set; }
    }
}
