namespace BSS_API.Models.ResponseModels;

public class ReconcileCountResponse
{
    public int TotalReconciled { get; set; }
    public int TotalPending { get; set; }
    public int TotalWarning { get; set; }
}
