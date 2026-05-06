namespace BSS_API.Models.ResponseModels;

public class EditVerifyTranResponse
{
    public long VerifyTranId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
