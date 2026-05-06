namespace BSS_API.Models.ResponseModels;

public class DeleteVerifyTranResponse
{
    public long VerifyTranId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
