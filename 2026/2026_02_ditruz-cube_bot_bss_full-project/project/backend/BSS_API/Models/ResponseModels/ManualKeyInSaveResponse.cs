namespace BSS_API.Models.ResponseModels;

public class ManualKeyInSaveResponse
{
    public long ReconcileTranId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
