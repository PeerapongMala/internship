namespace BSS_WEB.Models.ObjectModel
{
    public class SendMailOtpData
    {
        public string? refCode { get; set; }
        public int otpExpireIn { get; set; }
        public bool isSuccess { get; set; }
        public string? responseMessage { get; set; }
        public string? bssMailSystemTypeCode { get; set; }
    }
}
