namespace BSS_WEB.Models.ObjectModel;

public class DeleteReconsileTranRequest
{
    public long ReconsileTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
