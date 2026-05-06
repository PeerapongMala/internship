using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterCashPointDisplay
    {
        [Display(Name = "Cash Point Id")]
        public int cashpointId { get; set; }

        [Display(Name = "Institution Id")]
        public int institutionId { get; set; }

        [Display(Name = "Department Id")]
        public int departmentId { get; set; }

       

        [Display(Name = "Cash Point Name")]
        
        public string cashpointName { get; set; }

        [Display(Name = "Branch Code")]
        
        public string branchCode { get; set; }

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

        [Display(Name = "Institution Code")]
        public string? institutionCode { get; set; }

        [Display(Name = "Institution Name Th")]
        public string institutionNameTh { get; set; }
        [Display(Name = "Institution Name En")]
        public string? institutionNameEn { get; set; }

        [Display(Name = "Department Name")]
        public string? departmentName { get; set; }


        public string? CbBcdCode { get; set; }
    }
}
