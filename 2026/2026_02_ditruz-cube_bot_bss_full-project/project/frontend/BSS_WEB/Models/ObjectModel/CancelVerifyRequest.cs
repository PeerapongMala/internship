namespace BSS_WEB.Models.ObjectModel;

public class CancelVerifyRequest
{
    public long VerifyTranId { get; set; }
    public string? Remark { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}
