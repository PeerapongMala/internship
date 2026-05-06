using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterRoleDisplay
    {
        [Display(Name = "Role Id")]
        public int roleId { get; set; }

        [Display(Name = "Role Group Id")]
        public int roleGroupId { get; set; }

        [Display(Name = "Role Group Name")]
        public string roleGroupName { get; set; }

        [MaxLength(10)]
        [Display(Name = "Role Code")]
        public string roleCode { get; set; }

        [MaxLength(50)]
        [Display(Name = "Role Name")]
        public string roleName { get; set; }

        [MaxLength(100)]
        [Display(Name = "Role Description")]
        public string? roleDescription { get; set; }
        
        [Display(Name = "Seq No")]
        public int? seqNo { get; set; }

        [Display(Name = "Is Get Otp Supervisor")]
        public bool isGetOtpSupervisor { get; set; }

        [Display(Name = "Is Get Otp Manager")]
        public bool isGetOtpManager { get; set; }

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
