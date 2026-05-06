namespace BSS_WEB.Models.ObjectModel;

public class DeleteRevokeTranRequest
{
    public long VerifyTranId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
