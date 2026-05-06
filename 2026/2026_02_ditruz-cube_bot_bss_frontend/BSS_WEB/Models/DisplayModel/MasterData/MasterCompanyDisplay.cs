using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterCompanyDisplay
    {
        [Display(Name = "Company Id")]
        public int companyId { get; set; }

        [Display(Name = "Company Code")]
        [MaxLength(10)]
        public string companyCode { get; set; }

        [Display(Name = "Company Name")]
        [MaxLength(100)]
        public string companyName { get; set; }

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
