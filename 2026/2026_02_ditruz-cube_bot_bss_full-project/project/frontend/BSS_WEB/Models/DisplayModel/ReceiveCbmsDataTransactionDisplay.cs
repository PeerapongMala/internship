namespace BSS_WEB.Models.DisplayModel;

public class ReceiveCbmsDataTransactionDisplay
{
    public long ReceiveId { get; set; }

    public int DepartmentId { get; set; }

    public required string BnTypeInput { get; set; }

    public string? BarCode { get; set; }

    public string? ContainerId { get; set; }

    public DateTime? SendDate { get; set; }

    public int InstitutionId { get; set; }

    public int DenominationId { get; set; }

    public int? Qty { get; set; }

    public int? RemainingQty { get; set; }

    public int? UnfitQty { get; set; }

    public string? CbBdcCode { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}

