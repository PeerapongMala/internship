namespace BSS_API.Models.ResponseModels;

public class ReconcileScanResponse
{
    public long ReconcileTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
