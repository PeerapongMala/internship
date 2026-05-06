namespace BSS_API.Models.RequestModels;

public class RevokeActionRequest
{
    public List<long> ReconcileTranIds { get; set; } = new();
    public int ManagerId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
