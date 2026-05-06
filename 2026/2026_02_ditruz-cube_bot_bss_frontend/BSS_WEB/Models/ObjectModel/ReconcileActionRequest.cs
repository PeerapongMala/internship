namespace BSS_WEB.Models.ObjectModel;

public class ReconcileActionRequest
{
    public long ReconcileTranId { get; set; }
    public List<ReconcileDenominationItem>? Denominations { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}

public class ReconcileDenominationItem
{
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
