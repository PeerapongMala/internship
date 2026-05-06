using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateM7DenomSeriesRequest  
    {
        [Required]
        public int MSevenDenomId { get; set; }

        [Required]
        public int SeriesDenomId { get; set; }

        public bool? IsActive { get; set; }

    }
}
