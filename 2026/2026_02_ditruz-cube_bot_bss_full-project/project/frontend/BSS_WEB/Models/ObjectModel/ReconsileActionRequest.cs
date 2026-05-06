namespace BSS_WEB.Models.ObjectModel;

public class ReconsileActionRequest
{
    public long ReconsileTranId { get; set; }
    public List<ReconsileDenominationItem>? Denominations { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}

public class ReconsileDenominationItem
{
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
