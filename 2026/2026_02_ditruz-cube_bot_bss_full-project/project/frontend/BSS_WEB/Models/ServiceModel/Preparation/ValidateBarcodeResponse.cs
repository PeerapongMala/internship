using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Models.ServiceModel.Preparation;

public class ValidateBarcodeData
{
    public bool IsValid { get; set; } = false;

    public bool IsRemainingZero { get; set; } = false;

    public bool IsAllRemainingZero { get; set; } = false;

    public string? ErrorMessage { get; set; }

    public string? MachineConflictMessage { get; set; }

    public List<PreparationAllTypeResponse> Data { get; set; } = new();

}

public class PreparationAllTypeResponse
{
    public long PrepareId { get; set; }

    public long? ContainerPrepareId { get; set; }

    public long? UnSortCCId { get; set; }

    /// <summary>
    /// barcode ภาชนะ
    /// </summary>
    public string? ContainerCode { get; set; }

    /// <summary>
    /// barcode ภาชนะ
    /// </summary>
    public string? Barcode { get; set; }

    /// <summary>
    /// barcode ห่อ
    /// </summary>
    public string? PackageCode { get; set; }

    /// <summary>
    /// barcode มัด
    /// </summary>
    public string? BundleCode { get; set; }

    public string? HeaderCardCode { get; set; }

    public string? BankCode { get; set; }

    public string? CashCenterName { get; set; }

    public string? CashPointName { get; set; }

    public int? DenominationPrice { get; set; }

    public int? ZoneId { get; set; }

    public string? ZoneName { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedByName { get; set; }

    public int? UpdatedBy { get; set; }

    public string? UpdatedByName { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsFlag { get; set; } = true;
}

public class ValidateBarcodeResponse : BaseApiResponse
{
    public ValidateBarcodeData? data { get; set; } = new ValidateBarcodeData();
}
