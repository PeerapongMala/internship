using DocumentFormat.OpenXml.Wordprocessing;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterInstitutionDisplay
    {
        [Display(Name = "Institution Id")]
        public int? institutionId { get; set; }

        [Display(Name = "Institution Code")]
        [MaxLength(10)]
        public string? institutionCode { get; set; }

        [Display(Name = "Bank Code")]
        [MaxLength(10)]
        public string? bankCode { get; set; }

        [Display(Name = "Institution Name TH")]
        [MaxLength(100)]
        public string? institutionNameTh { get; set; }

        [Display(Name = "Institution Name EN")]
        [MaxLength(100)]
        public string? institutionNameEn { get; set; }

        [Display(Name = "Institution Short Name")]
        public string? InstitutionShortName { get; set; }

        [Display(Name = "Is Active")]
        public bool? isActive { get; set; }

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
