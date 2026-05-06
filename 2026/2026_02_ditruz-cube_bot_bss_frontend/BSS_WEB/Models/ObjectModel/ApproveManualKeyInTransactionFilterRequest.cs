namespace BSS_WEB.Models.ObjectModel;

public class ApproveManualKeyInTransactionFilterRequest
{
    public int DepartmentId { get; set; }
    public int? BnTypeId { get; set; }
    public int? MachineId { get; set; }
    public string? HeaderCardCode { get; set; }
    public int? DenoId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
}
