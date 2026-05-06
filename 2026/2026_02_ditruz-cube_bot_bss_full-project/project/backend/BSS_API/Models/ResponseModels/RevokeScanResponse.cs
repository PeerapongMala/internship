namespace BSS_API.Models.ResponseModels;

public class RevokeExecuteResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public int AffectedCount { get; set; }
}
