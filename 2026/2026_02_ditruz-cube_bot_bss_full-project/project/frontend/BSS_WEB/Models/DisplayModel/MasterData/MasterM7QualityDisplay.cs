using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    
    public class MasterM7QualityDisplay
    {
        [Display(Name = "M7 Quality Id")]
        public int m7QualityId { get; set; }

      
        [Display(Name = "M7 Quality Code")]
        public string m7QualityCode { get; set; }

      
        [Display(Name = "M7 Quality Descrpt")]
        public string? m7QualityDescrpt { get; set; }

    
        [Display(Name = "M7 Quality Cps")]
        public string? m7QualityCps { get; set; }

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
