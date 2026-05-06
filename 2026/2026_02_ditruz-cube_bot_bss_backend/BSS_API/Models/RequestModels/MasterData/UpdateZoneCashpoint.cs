using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateZoneCashpoint
    {
        [Required]
        public int ZoneCashpointId { get; set; }

        [Required]
        public int ZoneId { get; set; }

        [Required]
        public int CashpointId { get; set; }

        public bool? IsActive { get; set; }

    }
}
