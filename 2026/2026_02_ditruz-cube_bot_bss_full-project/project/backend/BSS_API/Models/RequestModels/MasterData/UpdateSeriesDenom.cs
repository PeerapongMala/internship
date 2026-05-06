using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateSeriesDenom
    {
        [Required]
        public int SeriesDenomId { get; set; }

        [Required]
        [MaxLength(5)]
        public string SeriesCode { get; set; }

        [Required]
        [MaxLength(50)]
        public string SerieDescrpt { get; set; }

        public bool? IsActive { get; set; }

    }
}
