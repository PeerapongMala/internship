using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateMachineTypeRequest
    {

        [Required]
        [MaxLength(10)]
        public string MachineTypeCode { get; set; }

        [Required]
        [MaxLength(20)]
        public string MachineTypeName { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
