namespace BSS_API.Models.RequestModels;

public class VerifyActionRequest
{
    public long VerifyTranId { get; set; }
    public List<VerifyDenominationItem>? Denominations { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}

public class VerifyDenominationItem
{
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
