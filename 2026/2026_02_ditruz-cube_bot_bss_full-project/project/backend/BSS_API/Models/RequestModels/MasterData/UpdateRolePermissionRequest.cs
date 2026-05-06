using BSS_API.Models.ObjectModels;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateRolePermissionRequest
    {

        [Required]
        public int RoleId { get; set; }

        [Required]
        public List<CreateRoleMenuSelectedData> MenuItemSelected { get; set; } = new List<CreateRoleMenuSelectedData>();

        public bool? IsActive { get; set; }
    }
}
