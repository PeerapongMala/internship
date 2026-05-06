namespace BSS_WEB.Models.ServiceModel.Revoke;

public class RevokeExecuteResult
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public int AffectedCount { get; set; }
}
