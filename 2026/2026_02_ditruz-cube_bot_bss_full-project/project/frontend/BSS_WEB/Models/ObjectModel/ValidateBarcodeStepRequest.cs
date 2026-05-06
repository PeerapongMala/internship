namespace BSS_WEB.Models.ObjectModel;

public class ValidateBarcodeStepRequest
{
    public int StepIndex { get; set; }           // 1-4
    public string? ContainerBarcode { get; set; }
    public string? WrapBarcode { get; set; }
    public string? BundleBarcode { get; set; }
    public string? HeaderCardBarcode { get; set; }

    public string BssBNTypeCode { get; set; }

    public bool ValidateExistingInDatabase { get; set; } = true;
    public long? UnSortCcId { get; set; }
    public long? ReceiveId { get; set; }
}
