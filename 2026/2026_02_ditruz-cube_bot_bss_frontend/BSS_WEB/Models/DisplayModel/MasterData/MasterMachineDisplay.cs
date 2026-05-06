using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterMachineDisplay
    {
        [Display(Name = "Machine Id")]
        public int machineId { get; set; }

        [Display(Name = "Department Id")]
        public int departmentId { get; set; }

        [Display(Name = "Machine Type Id")]
        public int machineTypeId { get; set; }

        [MaxLength(20)]
        [Display(Name = "Machine Code")]
        public string? machineCode { get; set; }

        [MaxLength(30)]
        [Display(Name = "Machine Name")]
        public string machineName { get; set; }

        [Display(Name = "Hc Length")]
        public int hcLength { get; set; }

               

        [MaxLength(100)]
        [Display(Name = "Path Name Bss")]
        public string? pathnameBss { get; set; }

        [Display(Name = "Is Active")]
        public bool? isActive { get; set; }

        [Display(Name = "Is Emergency")]
        public bool? isEmergency { get; set; }

        [Display(Name = "Create By")]
        public int? createdBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? createdDate { get; set; }

        [Display(Name = "Update By")]
        public int? updatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? updatedDate { get; set; }

        [Display(Name = "Department Name")]
        [StringLength(100)]
        public string? departmentName { get; set; }

        [MaxLength(20)]
        [Display(Name = "Machine Type Name")]
        public string? machineTypeName { get; set; }
        [MaxLength(300)]
        [Display(Name = "Path Name Completed")]
        public string? PathnameCompleted { get; set; }
        [MaxLength(300)]
        [Display(Name = "Path Name Error")]
        public string? PathnameError { get; set; }

    }
}
