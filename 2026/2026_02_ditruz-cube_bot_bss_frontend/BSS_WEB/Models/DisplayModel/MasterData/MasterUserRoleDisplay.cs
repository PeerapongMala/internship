using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterUserRoleDisplay
    {
        [Display(Name = "User Role Id")]
        public int userRoleId { get; set; }

        [Display(Name = "User Id")]
        public int userId { get; set; }

        [Display(Name = "Role Id")]
        public int roleId { get; set; }

        [Display(Name = "Assigned DateTime")]
        public DateTime assignedDateTime { get; set; } = DateTime.Now;
        
        [Display(Name = "Is Active")]
        public bool isActive { get; set; }
    }
}
