using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateZoneCashpointRequest:CreateZoneCashpointRequest
    {
        [Required]
        public int ZoneCashpointId { get; set; } = 0;
        
    }
}
