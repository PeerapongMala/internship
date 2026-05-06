using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class UpdateM7DenominationRequest:CreateM7DenominationRequest
    {
        public int m7DenomId { get; set; } = 0;
        
    }
}
