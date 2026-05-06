using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class UpdateMachineTypeRequest
    {
        [Required]
        public int MachineTypeId { get; set; }

        [Required]
        [MaxLength(10)]
        public string MachineTypeCode { get; set; }

        [Required]
        [MaxLength(20)]
        public string MachineTypeName { get; set; }

        public bool? IsActive { get; set; }
         

        public DateTime? UpdatedDate { get; set; }
    }
}
