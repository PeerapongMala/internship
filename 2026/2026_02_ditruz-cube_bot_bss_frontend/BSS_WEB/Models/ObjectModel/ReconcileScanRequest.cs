namespace BSS_WEB.Models.ObjectModel;

public class ReconcileScanRequest
{
    public string HeaderCardCode { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int? MachineId { get; set; }
    public int? BnTypeId { get; set; }
    public int? ShiftId { get; set; }
    public int? SorterId { get; set; }
    public int CreatedBy { get; set; }
}
