using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateRoleRequest
    {
        [Required]
        public int RoleGroupId { get; set; }

        [Required]
        [MaxLength(10)]
        public string RoleCode { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; }

        [MaxLength(300)]
        public string? RoleDescription { get; set; }
        public bool IsGetOtpSupervisor { get; set; }
        public bool IsGetOtpManager { get; set; }

        public bool? IsActive { get; set; }

    }
}
