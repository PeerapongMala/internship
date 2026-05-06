using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class GetAllMasterCashPoint
    {
        [Display(Name = "Cash Point Id")]
        public int cashpointId { get; set; }

        [Display(Name = "Institution Id")]
        public int institutionId { get; set; }

        [Display(Name = "Department Id")]
        public int departmentId { get; set; }

        [Display(Name = "Cash Point Name")]
        [MaxLength(150)]
        public string cashpointName { get; set; }

        [Display(Name = "Brach Code")]
        [MaxLength(10)]
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
    }
}
