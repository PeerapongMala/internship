namespace BSS_API.Models.RequestModels;

public class ApproveManualKeyInActionRequest
{
    public long ApproveManualKeyInTranId { get; set; }
    public List<ApproveManualKeyInDenominationItem>? Denominations { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
    public string? Remark { get; set; }
}

public class ApproveManualKeyInDenominationItem
{
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
