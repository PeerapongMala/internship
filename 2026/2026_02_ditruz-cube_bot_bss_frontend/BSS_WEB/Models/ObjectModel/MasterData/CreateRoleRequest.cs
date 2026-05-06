namespace BSS_WEB.Models.ObjectModel
{
    public class CreateRoleRequest
    {
        public int roleGroupId { get; set; } = 0;
        public string roleCode { get; set; } = string.Empty;
        public string roleName { get; set; } = string.Empty;
        public string? roleDescription { get; set; } = string.Empty;
        public bool isGetOtpSupervisor { get; set; } = false;
        public bool isGetOtpManager { get; set; } = false;
        public bool isActive { get; set; } = false;
        
    }
}
