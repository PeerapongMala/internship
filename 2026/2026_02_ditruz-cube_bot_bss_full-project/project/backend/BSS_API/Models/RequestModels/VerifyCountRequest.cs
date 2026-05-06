namespace BSS_API.Models.RequestModels;

public class VerifyCountRequest
{
    public int DepartmentId { get; set; }
    public int? BnTypeId { get; set; }
    public int? MachineId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
