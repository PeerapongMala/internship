namespace BSS_API.Models.RequestModels;

public class CancelReconcileRequest
{
    public long ReconcileTranId { get; set; }
    public string? Remark { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}
