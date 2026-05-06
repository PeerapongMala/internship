namespace BSS_WEB.Models.ServiceModel.ApproveManualKeyIn
{
    public class ApproveManualKeyInDetailResult
    {
        public long ApproveManualKeyInTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public List<ApproveManualKeyInDenominationDetailResult>? Denominations { get; set; }
        public int? TotalQty { get; set; }
        public int? TotalValue { get; set; }
    }

    public class ApproveManualKeyInDenominationDetailResult
    {
        public long ApproveManualKeyInId { get; set; }
        public int DenoPrice { get; set; }
        public string? BnType { get; set; }
        public string? DenomSeries { get; set; }
        public int Qty { get; set; }
        public int TotalValue { get; set; }
        public string? TmpAction { get; set; }
        public bool? IsReplaceT { get; set; }
        public bool? IsReplaceC { get; set; }
        public string? AdjustType { get; set; }
        public bool? IsNormal { get; set; }
        public bool? IsAddOn { get; set; }
        public bool? IsEndJam { get; set; }
    }
}
