namespace BSS_API.Models.RequestModels;

public class DeleteVerifyTranRequest
{
    public long VerifyTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
