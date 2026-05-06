using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateZoneCashpointRequest
    {
        [Required]
        public int ZoneCashpointId { get; set; } = 0;
        [Required]
        public int ZoneId { get; set; }
        [Required]
        public int CashpointId { get; set; }
        [Required]
        public bool? isActive { get; set; }
        
    }
}
