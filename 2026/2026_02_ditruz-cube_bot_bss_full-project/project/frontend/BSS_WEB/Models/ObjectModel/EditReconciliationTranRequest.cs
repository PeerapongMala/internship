namespace BSS_WEB.Models.ObjectModel;

public class EditReconciliationTranRequest
{
    public long ReconciliationTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
