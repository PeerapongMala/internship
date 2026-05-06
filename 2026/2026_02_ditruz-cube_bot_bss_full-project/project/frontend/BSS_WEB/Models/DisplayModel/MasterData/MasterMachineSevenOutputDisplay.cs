using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterMachineSevenOutputDisplay
    { 

        [Display(Name = "MSeven Output Id")]
        public int mSevenOutputId { get; set; }
 
        [Display(Name = "MSeven Output Code")]
        public string mSevenOutputCode { get; set; }
         
        [Display(Name = "MSeven Output Descrpt")]
        public string? mSevenOutputDescrpt { get; set; }

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
