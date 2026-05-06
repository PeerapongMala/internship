using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterStatusDisplay
    {
        [Display(Name = "Status Id")]
        public int statusId { get; set; }

        [MaxLength(10)]
        [Display(Name = "Status Code")]
        public string statusCode { get; set; }

        [MaxLength(20)]
        [Display(Name = "Status Name Th")]
        public string statusNameTh { get; set; }

        [MaxLength(20)]
        [Display(Name = "Status Name En")]
        public string statusNameEn { get; set; }

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
