namespace BSS_API.Models.RequestModels;

public class CancelReconciliationRequest
{
    public long ReconciliationTranId { get; set; }
    public string? Remark { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}
