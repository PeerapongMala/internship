namespace BSS_WEB.Models.ObjectModel;

public class EditApproveManualKeyInTranRequest
{
    public long ApproveManualKeyInTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
