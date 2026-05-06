namespace BSS_API.Models.ResponseModels;

public class ReconciliationDetailResponse
{
    public long ReconciliationTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public List<ReconciliationDenominationDetail>? Denominations { get; set; }
    public int? TotalQty { get; set; }
    public int? TotalValue { get; set; }
}

public class ReconciliationDenominationDetail
{
    public long ReconciliationId { get; set; }
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int DenoPrice { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
    public bool? IsReplaceT { get; set; }
    public bool? IsReplaceC { get; set; }
    public string? AdjustType { get; set; }
    public string? HeaderCardCode { get; set; }
    public bool? IsNormal { get; set; }
    public bool? IsAddOn { get; set; }
    public bool? IsEndJam { get; set; }
    public DateTime? CreatedDate { get; set; }
}
