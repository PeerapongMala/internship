namespace BSS_API.Models.ResponseModels;

public class DeleteApproveManualKeyInTranResponse
{
    public long ApproveManualKeyInTranId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
