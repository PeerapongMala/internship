namespace BSS_API.Models.ResponseModels;

public class VerifyCountResponse
{
    public int TotalVerified { get; set; }
    public int TotalPending { get; set; }
    public int TotalWarning { get; set; }
}
