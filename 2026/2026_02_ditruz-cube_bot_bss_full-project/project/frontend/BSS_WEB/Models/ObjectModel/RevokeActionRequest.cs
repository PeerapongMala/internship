namespace BSS_WEB.Models.ObjectModel;

public class RevokeActionRequest
{
    public List<long> ReconcileTranIds { get; set; } = new();
    public int ManagerId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
