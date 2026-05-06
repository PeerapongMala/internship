using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateMachineRequest
    {
        [Required]
        public int machineId { get; set; } = 0;
        [Required]
        public int departmentId { get; set; }

        [Required]
        public int machineTypeId { get; set; }

        [Required]
        [MaxLength(20)]
        public string machineCode { get; set; }

        [Required]
        [MaxLength(30)]
        public string machineName { get; set; }

        public int? hcLength { get; set; }

        [MaxLength(300)]
        public string? pathnameBss { get; set; }
        [MaxLength(300)]
        public string? pathnameCompleted { get; set; }
        [MaxLength(300)]
        public string? pathnameError { get; set; }

        public bool? isEmergency { get; set; }

        public bool? isActive { get; set; }
        public int? updatedBy { get; set; }
    }
}
