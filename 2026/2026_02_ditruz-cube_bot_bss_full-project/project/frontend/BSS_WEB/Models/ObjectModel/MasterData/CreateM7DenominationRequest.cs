using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class CreateM7DenominationRequest
    {
        public int denoId { get; set; } = 0;
        public string m7DenomCode { get; set; } = string.Empty;
        public string m7DenomName { get; set; } = string.Empty;
        public string m7DenomDescrpt { get; set; } = string.Empty;
        public string m7DenomBms { get; set; } = string.Empty;
        public string m7DnBms { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
        public int seriesDenomId { get; set; } = 0;
    }
}
