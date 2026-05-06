namespace BSS_API.Models.RequestModels;

public class HoldingFilterRequest
{
    public int DepartmentId { get; set; }
    public int? ShiftId { get; set; }
    public int? MachineHdId { get; set; }
}
