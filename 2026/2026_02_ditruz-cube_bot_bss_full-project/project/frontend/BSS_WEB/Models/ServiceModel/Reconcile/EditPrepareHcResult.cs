namespace BSS_WEB.Models.ServiceModel.Reconcile;

public class EditPrepareHcResult
{
    public long PrepareId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
