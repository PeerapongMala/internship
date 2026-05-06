namespace BSS_WEB.Models.ObjectModel;

public class RevokeActionRequest
{
<<<<<<< HEAD
    public long VerifyTranId { get; set; }
    public List<RevokeDenominationItem>? Denominations { get; set; }
    public int? SupervisorId { get; set; }
    public string? OtpCode { get; set; }
    public int UpdatedBy { get; set; }
}

public class RevokeDenominationItem
{
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
=======
    public List<long> ReconcileTranIds { get; set; } = new();
    public int ManagerId { get; set; }
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
