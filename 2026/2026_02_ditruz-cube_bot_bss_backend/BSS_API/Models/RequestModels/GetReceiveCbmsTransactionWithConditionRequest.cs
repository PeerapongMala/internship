using BSS_API.Helpers.Filters;

namespace BSS_API.Models.RequestModels;

public class GetReceiveCbmsTransactionWithConditionRequest
{
    public long? ReceiveId { get; set; }

    public int? DepartmentId { get; set; }

    public int? CompanyId { get; set; }

    public string? BnTypeInput { get; set; }

    public string? BarCode { get; set; }

    public string? ContainerId { get; set; }

    public DateTime? SendDate { get; set; }
    [Filter(FilterOp.GreaterThanOrEqual, "SendDate")]
    public DateTime? SendDateFrom { get; set; }

    [Filter(FilterOp.LessThanOrEqual, "SendDate")]
    public DateTime? SendDateTo { get; set; }

    public int? InstitutionId { get; set; }

    public int? DenominationId { get; set; }

    public int? Qty { get; set; }

    public int? RemainingQty { get; set; }

    public int? UnfitQty { get; set; }

    public string? CbBdcCode { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
    
    [Filter(FilterOp.GreaterThanOrEqual, "CreatedDate")]
    public DateTime? CreatedDateFrom { get; set; }
    
    [Filter(FilterOp.LessThanOrEqual, "CreatedDate")]
    public DateTime? CreatedDateTo { get; set; }
}
