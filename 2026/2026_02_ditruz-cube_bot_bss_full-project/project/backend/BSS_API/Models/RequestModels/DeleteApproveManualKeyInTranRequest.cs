namespace BSS_API.Models.RequestModels;

public class DeleteApproveManualKeyInTranRequest
{
    public long ApproveManualKeyInTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
