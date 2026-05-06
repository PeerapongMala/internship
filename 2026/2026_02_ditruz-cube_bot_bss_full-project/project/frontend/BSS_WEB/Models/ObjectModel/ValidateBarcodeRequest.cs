namespace BSS_WEB.Models.ObjectModel
{
    public class ValidateBarcodeRequest
    {
        public required string ValidateBarcodeType { get; set; }

        public int? DepartmentId { get; set; }

        public string? ContainerId { get; set; }

        public int? MachineId { get; set; }

        public string BssBNTypeCode { get; set; } = string.Empty;

        public bool ValidateExistingInDatabase { get; set; } = true;

        public ICollection<ValidateBarcodeItem> ValidateBarcodeItem { get; set; } = new List<ValidateBarcodeItem>();
        public long? UnSortCcId { get; set; } = 0;
        public long? ReceiveId { get; set; } = 0;
    }

    public class ValidateBarcodeItem
    {
        public required string BarcodeType { get; set; }

        public required string BarcodeValue { get; set; }
    }
}
