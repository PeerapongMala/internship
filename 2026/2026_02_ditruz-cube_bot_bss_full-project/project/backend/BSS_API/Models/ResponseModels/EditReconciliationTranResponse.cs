namespace BSS_API.Models.ResponseModels;

public class EditReconciliationTranResponse
{
    public long ReconciliationTranId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
