namespace BSS_API.Models.RequestModels;

public class RevokeTransactionFilterRequest
{
    public int DepartmentId { get; set; }
    public int? BnTypeId { get; set; }
    public int? InstitutionId { get; set; }
    public int? ZoneId { get; set; }
    public int? CashpointId { get; set; }
    public int? DenominationId { get; set; }
    public string? HeaderCardCode { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
