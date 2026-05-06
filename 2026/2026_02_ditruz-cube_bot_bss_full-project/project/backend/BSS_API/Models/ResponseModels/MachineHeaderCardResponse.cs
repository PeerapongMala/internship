namespace BSS_API.Models.ResponseModels;

public class MachineHeaderCardResponse
{
    public long MachineHdId { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public int? DenominationPrice { get; set; }
    public int? MachineQty { get; set; }
    public string? DepositId { get; set; }
    public string? IsReject { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsWarning { get; set; }
    public bool HasAlert { get; set; }
    public string AlertMessage { get; set; } = string.Empty;
}
