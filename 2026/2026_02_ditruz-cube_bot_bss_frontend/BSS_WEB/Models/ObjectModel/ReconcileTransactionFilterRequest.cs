namespace BSS_WEB.Models.ObjectModel;

public class ReconcileTransactionFilterRequest
{
    public int DepartmentId { get; set; }
    public int? BnTypeId { get; set; }
<<<<<<< HEAD
=======
    public string? BnTypeCode { get; set; }
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    public int? MachineId { get; set; }
    public string? HeaderCardCode { get; set; }
    public int? DenoId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
}
