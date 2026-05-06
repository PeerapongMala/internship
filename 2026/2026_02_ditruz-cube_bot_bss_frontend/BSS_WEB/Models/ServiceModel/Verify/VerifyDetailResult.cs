namespace BSS_WEB.Models.ServiceModel.Verify
{
    public class VerifyDetailResult
    {
        public long VerifyTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public List<VerifyDenominationDetailResult>? Denominations { get; set; }
        public int? TotalQty { get; set; }
        public int? TotalValue { get; set; }
    }

    public class VerifyDenominationDetailResult
    {
        public long VerifyId { get; set; }
        public string? BnType { get; set; }
        public string? DenomSeries { get; set; }
        public int Qty { get; set; }
        public int TotalValue { get; set; }
        public bool? IsReplaceT { get; set; }
        public bool? IsReplaceC { get; set; }
        public string? AdjustType { get; set; }
        public bool? IsNormal { get; set; }
        public bool? IsAddOn { get; set; }
        public bool? IsEndJam { get; set; }
    }
}
