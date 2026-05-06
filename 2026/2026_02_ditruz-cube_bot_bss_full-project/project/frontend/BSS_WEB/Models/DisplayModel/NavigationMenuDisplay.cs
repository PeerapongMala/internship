using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class NavigationMenuDisplay
    {
        [Display(Name = "Menu Id")]
        public int menuId { get; set; }

        [Display(Name = "Menu Name")]
        public string menuName { get; set; }

        [Display(Name = "Menu Path")]
        [MaxLength(500)]
        public string? menuPath { get; set; }

        [Display(Name = "Controller Name")]
        [MaxLength(100)]
        public string? controllerName { get; set; }

        [Display(Name = "Action Name")]
        [MaxLength(100)]
        public string? actionName { get; set; }

        [Display(Name = "Parent Menu Id")]
        public int? parentMenuId { get; set; }

        [Display(Name = "Display Order")]
        public int displayOrder { get; set; }

        [Display(Name = "Is Active")]
        public bool? IsActive { get; set; }

        [Display(Name = "Assigned DateTime")]
        public DateTime? assignedDate { get; set; }
    }
}
