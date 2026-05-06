namespace BSS_WEB.Models.ServiceModel.Preparation;

public class PreparationUnfitResult
{
    public long PrepareId { get; set; }

    public string? InstitutionCode { get; set; }

    public string? BankCode { get; set; }

    public string? ContainerCode { get; set; }

    public string? HeaderCardCode { get; set; }

    public string? PackageCode { get; set; }

    public string? BundleCode { get; set; }

    public string? CashCenterName { get; set; }

    public int? DenominationPrice { get; set; }

    public string? StatusCode { get; set; }

    public string? StatusNameTh { get; set; }

    public string? StatusNameEn { get; set; }

    public string? BanknoteTypeCode { get; set; }

    public string? BssBanknoteTypeCode { get; set; }

    public string? BanknoteTypeName { get; set; }

    public DateTime PrepareDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
    public string? CreatedByName { get; set; }
    public int? UpdatedBy { get; set; }
    public string? UpdatedByName { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsFlag { get; set; } = true;
}
