namespace BSS_API.Models.RequestModels
{
    public class MasterBanknoteTypeRequest
    {
        public int? BanknoteTypeId { get; set; }
        public string BanknoteTypeCode { get; set; } = string.Empty;
        public string BssBanknoteTypeCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
        public bool? IsDisplay { get; set; }
    }
}
