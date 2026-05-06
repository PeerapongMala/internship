using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateUserRoleRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int RoleGroupId { get; set; }

        [Required]
        public DateTime AssignedDateTime { get; set; } = DateTime.Now;

        public bool? IsActive { get; set; }

        
    }
}
