using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateMachineTypeRequest
    { 
        [Required]
        public string machineTypeCode { get; set; } = string.Empty;
        [Required]
        public string machineTypeName { get; set; } = string.Empty;
        [Required]
        public bool isActive { get; set; } = false;
      
    }
}
