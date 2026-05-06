namespace BSS_WEB.Models.ServiceModel.Revoke;

public class RevokeTransactionResult
{
    public long ReconcileTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public int DepartmentId { get; set; }
    public string? Bank { get; set; }
    public string? Zone { get; set; }
    public string? Cashpoint { get; set; }
    public int? DenominationPrice { get; set; }
    public int? ReconcileQty { get; set; }
    public int? ReconcileTotalValue { get; set; }
    public int StatusId { get; set; }
    public string? StatusName { get; set; }
    public int ShiftId { get; set; }
    public string? ShiftName { get; set; }
    public DateTime CreatedDate { get; set; }
    public List<RevokeDenominationDetailResult>? Denominations { get; set; }
}

public class RevokeDenominationDetailResult
{
    public long ReconcileId { get; set; }
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int DenoPrice { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
