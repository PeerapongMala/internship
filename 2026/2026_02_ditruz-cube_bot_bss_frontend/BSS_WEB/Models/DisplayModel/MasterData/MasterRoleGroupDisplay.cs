using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterRoleGroupDisplay
    {
        [Display(Name = "Role Group Id")]
        public int roleGroupId { get; set; }

        [Display(Name = "Role Group Code")]
        public string roleGroupCode { get; set; }

        [Display(Name = "Role Group Name")]
        public string roleGroupName { get; set; }

        [Display(Name = "Is Active")]
        public bool isActive { get; set; }

        [Display(Name = "Create By")]
        public int? createdBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? createdDate { get; set; }

        [Display(Name = "Update By")]
        public int? updatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? updatedDate { get; set; }
    }
}
