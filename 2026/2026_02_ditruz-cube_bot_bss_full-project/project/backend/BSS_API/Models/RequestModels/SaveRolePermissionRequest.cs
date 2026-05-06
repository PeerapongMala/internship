using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.RequestModels
{
    public class SaveRolePermissionRequest
    {
              
        [Required]
        public int RoleId { get; set; }

        [Required]
        public List<CreateRoleMenuSelectedData> MenuItemSelected { get; set; } = new List<CreateRoleMenuSelectedData>();
        
        public bool? IsActive { get; set; }
       
    }
}
