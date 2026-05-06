using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterMachineTypeDisplay
    {
        [Display(Name = "Machine Type Id")]
        public int machineTypeId { get; set; }

       
        [Display(Name = "Machine Type Code")]
        public string machineTypeCode { get; set; }
 
        [Display(Name = "Machine Type Name")]
        public string machineTypeName { get; set; }

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
