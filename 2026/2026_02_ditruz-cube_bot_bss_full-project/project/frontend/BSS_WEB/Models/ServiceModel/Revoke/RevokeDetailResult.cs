namespace BSS_WEB.Models.ServiceModel.Revoke;

public class RevokeDetailResult
{
    public long ReconcileTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public string? Bank { get; set; }
    public string? Cashpoint { get; set; }
    public int? DenominationPrice { get; set; }
    public List<RevokeDetailRow>? Rows { get; set; }
    public int TotalQty { get; set; }
    public int TotalValue { get; set; }
}

public class RevokeDetailRow
{
    public long ReconcileId { get; set; }
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int DenoPrice { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
