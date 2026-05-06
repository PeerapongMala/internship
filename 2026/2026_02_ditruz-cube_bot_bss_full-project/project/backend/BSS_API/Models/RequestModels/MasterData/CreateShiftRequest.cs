using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateShiftRequest
    {
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
