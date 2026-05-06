namespace BSS_API.Models.RequestModels
{
    public class MasterDenominationRequest
    {
        public int? DenominationId { get; set; }
        public int? DenominationCode { get; set; }
        public string DenominationCurrency { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}
