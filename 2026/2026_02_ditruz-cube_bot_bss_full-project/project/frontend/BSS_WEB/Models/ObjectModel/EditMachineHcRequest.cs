namespace BSS_WEB.Models.ObjectModel;

public class EditMachineHcRequest
{
    public long MachineHdId { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public string? Remark { get; set; }
    public int UpdatedBy { get; set; }
}
