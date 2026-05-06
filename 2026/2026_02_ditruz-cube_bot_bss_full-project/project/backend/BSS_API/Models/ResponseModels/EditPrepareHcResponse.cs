namespace BSS_API.Models.ResponseModels;

public class EditPrepareHcResponse
{
    public long PrepareId { get; set; }
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}
