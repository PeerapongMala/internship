namespace BSS_API.Models.RequestModels
{
    using System.ComponentModel.DataAnnotations;

    public class ValidateBarcodeRequest
    {
        [Required] public string ValidateBarcodeType { get; set; }

        public int? DepartmentId { get; set; }

        public string? ContainerId { get; set; }

        public int? MachineId { get; set; }

        [Required] public string BssBNTypeCode { get; set; }
        
        public bool ValidateExistingInDatabase { get; set; } = true;

        public ICollection<ValidateBarcodeItem> ValidateBarcodeItem { get; set; } = new List<ValidateBarcodeItem>();
    }

    public class ValidateBarcodeItem
    {
        [Required] public string BarcodeType { get; set; }

        [Required] public string BarcodeValue { get; set; }
    }
}