namespace BSS_API.Models.ResponseModels;

public class EditMachineHcResponse
{
    public long MachineHdId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
