namespace BSS_API.Models.RequestModels;

public class ReconciliationActionRequest
{
    public long ReconciliationTranId { get; set; }
    public List<ReconciliationDenominationItem>? Denominations { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}

public class ReconciliationDenominationItem
{
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int DenoPrice { get; set; }
    public string? AdjustType { get; set; }
    public string? HeaderCardCode { get; set; }
    public DateTime? CountedDate { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
    public bool? IsReplaceT { get; set; }
    public bool? IsReplaceC { get; set; }
}
