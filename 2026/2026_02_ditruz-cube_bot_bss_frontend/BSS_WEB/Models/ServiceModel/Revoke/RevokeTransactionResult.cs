<<<<<<< HEAD
namespace BSS_WEB.Models.ServiceModel.Revoke
{
    public class RevokeTransactionResult
    {
        public long VerifyTranId { get; set; }
        public long ReconcileTranId { get; set; }
        public long PrepareId { get; set; }
        public string? HeaderCardCode { get; set; }
        public int DepartmentId { get; set; }
        public int MachineHdId { get; set; }
        public string? MachineName { get; set; }
        public int? DenominationPrice { get; set; }
        public string? StatusCode { get; set; }
        public string? StatusNameTh { get; set; }
        public string? StatusNameEn { get; set; }
        public int StatusId { get; set; }
        public int? M7Qty { get; set; }
        public int? VerifyQty { get; set; }
        public int? SupQty { get; set; }
        public int? BundleNumber { get; set; }
        public int? VerifyTotalValue { get; set; }
        public bool? IsWarning { get; set; }
        public bool? IsNotVerify { get; set; }
        public string? Remark { get; set; }
        public string? AlertRemark { get; set; }
        public string? ReferenceCode { get; set; }
        public int? SorterId { get; set; }
        public string? SorterName { get; set; }
        public int ShiftId { get; set; }
        public string? ShiftName { get; set; }
        public DateTime? PrepareDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public string? UpdatedByName { get; set; }
    }
=======
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
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
}
