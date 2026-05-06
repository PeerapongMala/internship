namespace BSS_API.Models.ResponseModels;

public class VerifyHeaderCardDetailResponse
{
    public long VerifyTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public DateTime? Date { get; set; }
    public string? SorterName { get; set; }
    public string? VerifierName { get; set; }
    public string? SortingMachineName { get; set; }
    public string? ShiftName { get; set; }
}
