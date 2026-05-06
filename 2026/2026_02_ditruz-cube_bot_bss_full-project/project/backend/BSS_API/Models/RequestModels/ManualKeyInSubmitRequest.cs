namespace BSS_API.Models.RequestModels;

public class ManualKeyInSubmitRequest
{
    public long ReconcileTranId { get; set; }
    public int SupervisorId { get; set; }
    public string OtpCode { get; set; } = string.Empty;
    public int UpdatedBy { get; set; }
    public string? Remark { get; set; }
    public string? RefDocNo { get; set; }
}
