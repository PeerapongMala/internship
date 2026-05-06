using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateDenominationRequest
    {
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

        public int? CreatedBy { get; set; }

    }
}
