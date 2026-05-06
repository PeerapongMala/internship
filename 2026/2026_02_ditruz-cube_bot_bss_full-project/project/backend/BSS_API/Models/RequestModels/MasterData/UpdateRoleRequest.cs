using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateRoleRequest
    {
        [Required]
        public int RoleGroupId { get; set; }

        [Required]
        public int RoleId { get; set; }

        [Required]
        [MaxLength(10)]
        public string RoleCode { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; }

        [MaxLength(100)]
        public string? roleDescription { get; set; }
        public bool IsGetOtpSupervisor { get; set; }
        public bool IsGetOtpManager { get; set; }
        public bool? IsActive { get; set; } 
    }
}
