using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateMachineTypeRequest:CreateMachineTypeRequest
    {
        [Required]
        public int machineTypeId { get; set; } = 0;
        
       
    }
}
