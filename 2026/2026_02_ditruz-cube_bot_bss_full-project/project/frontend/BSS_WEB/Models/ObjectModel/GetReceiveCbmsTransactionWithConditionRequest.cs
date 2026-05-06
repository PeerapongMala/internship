namespace BSS_WEB.Models.ObjectModel;

public class GetReceiveCbmsTransactionWithConditionRequest
{
    public long? ReceiveId { get; set; }

    public int? DepartmentId { get; set; }

    public int? CompanyId { get; set; }
    public string? BnTypeInput { get; set; }

    public string? BarCode { get; set; }

    public string? ContainerId { get; set; }

    public DateTime? SendDate { get; set; }
    public DateTime? SendDateFrom { get; set; }
    public DateTime? SendDateTo { get; set; }

    public int? InstitutionId { get; set; }

    public int? DenominationId { get; set; }

    public int? Qty { get; set; }

    public int? RemainingQty { get; set; }

    public int? UnfitQty { get; set; }

    public string? CbBdcCode { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
    public DateTime? CreatedDateFrom { get; set; }
    public DateTime? CreatedDateTo { get; set; }
}
