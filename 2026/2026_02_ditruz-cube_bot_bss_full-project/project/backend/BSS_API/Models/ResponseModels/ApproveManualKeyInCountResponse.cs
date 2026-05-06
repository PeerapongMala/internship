namespace BSS_API.Models.ResponseModels;

public class ApproveManualKeyInCountResponse
{
    public int TotalApproved { get; set; }
    public int TotalPending { get; set; }
    public int TotalRejected { get; set; }
}
