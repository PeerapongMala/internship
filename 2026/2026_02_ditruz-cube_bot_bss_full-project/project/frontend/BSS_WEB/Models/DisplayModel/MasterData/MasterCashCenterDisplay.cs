using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterCashCenterDisplay
    {
        [Display(Name = "Cash Center Id")]
        public int cashCenterId { get; set; }

        [MaxLength(10)]
        [Display(Name = "Cash Center Code")]
        public string cashCenterCode { get; set; }

        [MaxLength(100)]
        [Display(Name = "Cash Center Name")]
        public string? cashCenterName { get; set; }

        [Display(Name = "Institution Id")]
        public int institutionId { get; set; }

        [Display(Name = "Department Id")]
        public int departmentId { get; set; }

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

        [Display(Name = "Bank Name")]
        public string? bankName { get; set; }

        [Display(Name = "Department Name")]
        public string departmentName { get; set; } = string.Empty;
         
        public string institutionNameTh { get; set; } = string.Empty;

        public string? institutionNameEn { get; set; } = string.Empty;

    }
}
