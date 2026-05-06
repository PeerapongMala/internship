namespace BSS_API.Models.RequestModels;

public class EditMachineHcRequest
{
    public long MachineHdId { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public string? Remark { get; set; }
    public int SupervisorId { get; set; }
    public string SupervisorRefCode { get; set; } = string.Empty;
    public string SupervisorOtpCode { get; set; } = string.Empty;
    public int UpdatedBy { get; set; }
}
