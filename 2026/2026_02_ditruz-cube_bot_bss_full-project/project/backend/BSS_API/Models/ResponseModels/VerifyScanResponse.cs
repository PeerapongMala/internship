namespace BSS_API.Models.ResponseModels;

public class VerifyScanResponse
{
    public long VerifyTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
