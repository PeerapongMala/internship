using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateDenominationRequest
    { 
        public int denominationCode { get; set; } = 0;
        public int denominationPrice { get; set; } = 0;
        public string denominationDesc { get; set; } = string.Empty;
        public string denominationCurrency { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
     
    }
}
