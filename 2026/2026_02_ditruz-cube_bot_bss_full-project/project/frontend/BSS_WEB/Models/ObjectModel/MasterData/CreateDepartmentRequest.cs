namespace BSS_WEB.Models.ObjectModel
{
    public class CreateDepartmentRequest
    {
        public int companyId { get; set; } = 0;
        public string departmentCode { get; set; } = string.Empty;
        public string departmentShortName { get; set; } = string.Empty;
        public string departmentName { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
        
    }
}
