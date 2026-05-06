using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateSeriesDenomRequest:CreateSeriesDenomRequest
    {
        [Required]
        public int seriesDenomId { get; set; }

        
    }
}