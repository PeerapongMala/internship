namespace BSS_WEB.Models.ObjectModel;

public class DeleteReconciliationTranRequest
{
    public long ReconciliationTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
