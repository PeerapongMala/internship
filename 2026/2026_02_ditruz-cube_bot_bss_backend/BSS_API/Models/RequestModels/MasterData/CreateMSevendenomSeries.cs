using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateMSevendenomSeries
    {
        [Required]
        public int MSevenDenomId { get; set; }

        [Required]
        public int SeriesDenomId { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
