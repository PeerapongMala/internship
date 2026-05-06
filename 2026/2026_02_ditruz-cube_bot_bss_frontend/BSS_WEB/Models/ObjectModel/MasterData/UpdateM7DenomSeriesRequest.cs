using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateM7DenomSeriesRequest: CreateM7DenomSeriesRequest
    {

        [Required]
        public int MSevendenomSeriesId { get; set; }

        

    }
}
