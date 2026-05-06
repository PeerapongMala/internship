namespace BSS_API.Models.ResponseModels;

public class ReconciliationTransactionResponse
{
    public long ReconciliationTranId { get; set; }
    public long PrepareId { get; set; }
    public string? HeaderCardCode { get; set; }
    public int DepartmentId { get; set; }
    public int? MachineHdId { get; set; }
    public string? MachineName { get; set; }
    public int? DenominationPrice { get; set; }
    public string? StatusCode { get; set; }
    public string? StatusNameTh { get; set; }
    public string? StatusNameEn { get; set; }
    public int StatusId { get; set; }
    public int? M7Qty { get; set; }
    public int? ReconciliationQty { get; set; }
    public int? SupQty { get; set; }
    public int? BundleNumber { get; set; }
    public int? ReconciliationTotalValue { get; set; }
    public bool? IsWarning { get; set; }
    public bool? IsNotReconcile { get; set; }
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
