namespace BSS_API.Models.RequestModels
{
    public class MasterBanknoteTypeSendRequest
    {
        public int? BanknoteTypeSendId { get; set; }
        public string BanknoteTypeSendCode { get; set; } = string.Empty;
        public string BssBntypeCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}
