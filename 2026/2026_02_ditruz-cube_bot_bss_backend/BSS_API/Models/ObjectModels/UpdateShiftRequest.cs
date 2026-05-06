using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class UpdateShiftRequest
    {

        [Required]
        public int ShiftId { get; set; }

        [Required]
        [MaxLength(10)]
        public string ShiftCode { get; set; }

        [MaxLength(20)]
        public string? ShiftName { get; set; }

        [Required]
        [MaxLength(10)]
        public string ShiftStartTime { get; set; }

        [Required]
        [MaxLength(10)]
        public string ShiftEndTime { get; set; }
        public bool? IsActive { get; set; } 
    }
}
