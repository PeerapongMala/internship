namespace BSS_WEB.Models.ObjectModel
{
    public class CreateBanknoteTypeRequest
    {
     
        public string banknoteTypeName { get; set; } = string.Empty;
        public string banknoteTypeCode { get; set; } = string.Empty;
        public string bssBanknoteTypeCode { get; set; } = string.Empty;
        public string banknoteTypeDesc { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
    }
}
