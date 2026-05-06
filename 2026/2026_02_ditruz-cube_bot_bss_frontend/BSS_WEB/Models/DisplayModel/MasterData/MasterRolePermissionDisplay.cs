using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterRolePermissionDisplay
    {
        [Display(Name = "Role Permission Id")]
        public int rolePermissionId { get; set; }

        [Display(Name = "Role Id")]
        public int roleId { get; set; }

        [Display(Name = "Menu Id")]
        public int menuId { get; set; }

        [Display(Name = "Assigned DateTime")]
        public DateTime? assignedDateTime { get; set; }

        [Display(Name = "Is Active")]
        public bool isActive { get; set; }

        [MaxLength(50)]
        [Display(Name = "Role Name")]
        public string roleName { get; set; }

        [Display(Name = "Menu Name")]
        [MaxLength(100)]
        public string menuName { get; set; }

    }
}
