namespace BSS_API.Models.RequestModels
{
    public class MasterCashTypeRequest
    {
        public int? CashTypeId { get; set; }
        public string CashTypeCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    
    }
}
