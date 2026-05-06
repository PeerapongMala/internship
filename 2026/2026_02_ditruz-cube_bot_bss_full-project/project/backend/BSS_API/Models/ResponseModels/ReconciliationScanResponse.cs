namespace BSS_API.Models.ResponseModels;

public class ReconciliationScanResponse
{
    public long ReconciliationTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
