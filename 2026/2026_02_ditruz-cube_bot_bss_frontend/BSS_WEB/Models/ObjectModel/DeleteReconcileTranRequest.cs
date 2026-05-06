namespace BSS_WEB.Models.ObjectModel;

public class DeleteReconcileTranRequest
{
    public long ReconcileTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
