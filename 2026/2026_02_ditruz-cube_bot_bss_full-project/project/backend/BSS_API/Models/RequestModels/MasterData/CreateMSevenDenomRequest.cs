using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateMSevenDenomRequest
    {

        [Required]
        public int DenoId { get; set; }

        [Required]
        [MaxLength(10)]
        public string M7DenomCode { get; set; }

        [Required]
        [MaxLength(20)]
        public string M7DenomName { get; set; }

        [MaxLength(30)]
        public string M7DenomDescrpt { get; set; }

        [MaxLength(10)]
        public string M7DenomBms { get; set; }

        [MaxLength(10)]
        public string M7DnBms { get; set; }

        public bool? IsActive { get; set; }

        [Required]
        public int SeriesDenomId { get; set; }
    }
}
