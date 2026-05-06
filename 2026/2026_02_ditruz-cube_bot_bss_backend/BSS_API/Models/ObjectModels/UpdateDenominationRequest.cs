using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class UpdateDenominationRequest
    {
        [Required]
        public int DenominationId { get; set; }

        [Required]
        //[MaxLength(10)] //only valid for string
        public int DenominationCode { get; set; }

        [Required]
        public int DenominationPrice { get; set; }

        [MaxLength(20)]
        public string? DenominationDesc { get; set; }

        [Required]
        [MaxLength(10)]
        public string DenominationCurrency { get; set; }

        public bool? IsActive { get; set; }
         
    
    }
}
