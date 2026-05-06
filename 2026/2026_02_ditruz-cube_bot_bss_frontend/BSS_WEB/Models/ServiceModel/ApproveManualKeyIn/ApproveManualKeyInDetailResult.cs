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
<<<<<<< HEAD
=======
        public int DenoPrice { get; set; }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        public string? BnType { get; set; }
        public string? DenomSeries { get; set; }
        public int Qty { get; set; }
        public int TotalValue { get; set; }
<<<<<<< HEAD
=======
        public string? TmpAction { get; set; }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        public bool? IsReplaceT { get; set; }
        public bool? IsReplaceC { get; set; }
        public string? AdjustType { get; set; }
        public bool? IsNormal { get; set; }
        public bool? IsAddOn { get; set; }
        public bool? IsEndJam { get; set; }
    }
}
