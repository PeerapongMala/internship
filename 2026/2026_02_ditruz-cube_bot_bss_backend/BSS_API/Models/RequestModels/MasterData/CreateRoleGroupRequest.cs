using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateRoleGroupRequest
    {
        
        [Required]
        [MaxLength(10)]
        public string RoleGroupCode { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoleGroupName { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
