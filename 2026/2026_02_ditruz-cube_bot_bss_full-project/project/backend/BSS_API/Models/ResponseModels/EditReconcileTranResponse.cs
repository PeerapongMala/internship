namespace BSS_API.Models.ResponseModels;

public class EditReconcileTranResponse
{
    public long ReconcileTranId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
