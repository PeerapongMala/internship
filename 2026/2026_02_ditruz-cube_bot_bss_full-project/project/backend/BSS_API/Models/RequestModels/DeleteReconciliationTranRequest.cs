namespace BSS_API.Models.RequestModels;

public class DeleteReconciliationTranRequest
{
    public long ReconciliationTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
