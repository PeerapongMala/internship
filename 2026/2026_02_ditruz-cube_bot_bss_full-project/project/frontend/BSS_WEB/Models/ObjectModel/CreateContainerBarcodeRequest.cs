namespace BSS_WEB.Models.ObjectModel;

public class CreateContainerBarcodeRequest
{
    public int DepartmentId { get; set; }

    public int? MachineId { get; set; }

    public int? CompanyId { get; set; }

    public long? ReceiveId { get; set; }

    public required string ContainerCode { get; set; }

    public string? PackageCode { get; set; }

    public string? BundleCode { get; set; }

    public required string HeaderCardCode { get; set; }

    public int InstitutionId { get; set; }

    public int? CashCenterId { get; set; } = null;

    public int DenominationId { get; set; }

    public int CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
    public int? CashpointId { get; set; }
    public int? ZoneId { get; set; }

    public long? UnSortCcId { get; set; }

    #region IsFirstScan

    public bool isFirstScan { get; set; } = true;

    #endregion IsFirstScan
}
