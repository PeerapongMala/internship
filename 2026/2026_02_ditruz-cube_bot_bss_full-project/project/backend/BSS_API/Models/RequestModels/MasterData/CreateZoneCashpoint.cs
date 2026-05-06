using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateZoneCashpoint
    {
        [Required]
        public int ZoneId { get; set; }

        [Required]
        public int CashpointId { get; set; }

        public bool? IsActive { get; set; }

      
    }
}
