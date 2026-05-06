namespace BSS_WEB.Models.ObjectModel;

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
    public string? AdjustType { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
