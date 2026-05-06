namespace BSS_API.Models.RequestModels;

public class EditVerifyTranRequest
{
    public long VerifyTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
