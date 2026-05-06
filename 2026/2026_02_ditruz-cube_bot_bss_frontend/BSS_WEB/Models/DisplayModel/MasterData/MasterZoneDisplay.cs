using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterZoneDisplay
    {
        [Display(Name = "Zone Id")]
        public int ZoneId { get; set; }

        [Display(Name = "Department Id")]
        public int? DepartmentId { get; set; }

        [Display(Name = "Inst Id")]
        public int? InstId { get; set; }

        [Display(Name = "Zone Code")]
        
        public string ZoneCode { get; set; }

        [Display(Name = "Zone Name")]
        
        public string ZoneName { get; set; }

        [Display(Name = "Is Active")]
        public bool? isActive { get; set; }

        [Display(Name = "Created By")]
        public int? CreatedBy { get; set; }

        [Display(Name = "Created Date")]
        public DateTime CreatedDate { get; set; }

        [Display(Name = "Updated By")]
        public int? UpdatedBy { get; set; }

        [Display(Name = "Updated Date")]
        public DateTime? UpdatedDate { get; set; }

        [Display(Name = "Department Name")]
        
        public string? DepartmentName { get; set; }

        [Display(Name = "Institution Name TH")]        
        public string? InstitutionNameTh { get; set; }

        [Display(Name = "Institution Name EN")]
        public string? InstitutionNameEN { get; set; }

        public string? CbBcdCode { get; set; }
    }
}
