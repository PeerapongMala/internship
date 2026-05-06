namespace BSS_WEB.Models.DisplayModel;

public class TransactionPreparationDisplay
{
    public long PrepareId { get; set; }

    public long ContainerPrepareId { get; set; }

    public required string HeaderCardCode { get; set; }

    public required string PackageCode { get; set; }

    public required string BundleCode { get; set; }

    public int InstId { get; set; }

    public int? CashcenterId { get; set; }

    public int? ZoneId { get; set; }

    public int? CashpointId { get; set; }

    public int DenoId { get; set; }

    public int Qty { get; set; }

    public long? UnsortCCId { get; set; }

    public string? Remark { get; set; }

    public int StatusId { get; set; }

    public DateTime PrepareDate { get; set; }

    public bool? IsReconcile { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}

