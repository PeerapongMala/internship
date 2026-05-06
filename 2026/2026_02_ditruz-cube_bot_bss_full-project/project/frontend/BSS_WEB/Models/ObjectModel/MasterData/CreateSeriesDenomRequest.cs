using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateSeriesDenomRequest
    {

        [Required]
        [MaxLength(5)]
        public string seriesCode { get; set; }

        [Required]
        [MaxLength(50)]
        public string serieDescrpt { get; set; }

        public bool? isActive { get; set; } 
    }
}
