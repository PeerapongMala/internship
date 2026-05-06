<<<<<<< HEAD
namespace BSS_WEB.Models.ServiceModel.Revoke
{
    public class RevokeDetailResult
    {
        public long VerifyTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public List<RevokeDenominationDetailResult>? Denominations { get; set; }
        public int? TotalQty { get; set; }
        public int? TotalValue { get; set; }
    }

    public class RevokeDenominationDetailResult
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
=======
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
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}
