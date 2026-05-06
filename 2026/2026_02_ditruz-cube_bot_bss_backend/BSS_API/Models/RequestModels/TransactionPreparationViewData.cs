public class TransactionPreparationViewData
{
    public long PrepareId { get; set; }

    public long ContainerPrepareId { get; set; }

    public string? ContainerCode { get; set; }

    public string HeaderCardCode { get; set; }

    public string PackageCode { get; set; }

    public string BundleCode { get; set; }

    public int InstId { get; set; }

    public string? InstitutionShortName { get; set; }

    public int? CashcenterId { get; set; }

    public string? CashCenterName { get; set; }

    public int? ZoneId { get; set; }

    public string? ZoneName { get; set; }

    public int? CashpointId { get; set; }

    public string? CashpointName { get; set; }

    public int DenoId { get; set; }

    public int? DenominationPrice { get; set; }

    public int Qty { get; set; }

    public string? Remark { get; set; }

    public int StatusId { get; set; }

    public string? StatusNameTh { get; set; }

    public DateTime PrepareDate { get; set; }

    public bool? IsReconcile { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
    public string  CreatedByName { get; set; }
    public int? UpdatedBy { get; set; }
    public string UpdatedByName { get; set; }
    public DateTime? UpdatedDate { get; set; }

}
