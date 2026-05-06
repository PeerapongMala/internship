namespace BSS_WEB.Models.ObjectModel
{
    public class VerifyOtpRequest
    {
        public int UserSendId { get; set; }
        public int UserSendDepartmentId { get; set; }
        public string BssMailSystemTypeCode { get; set; } = string.Empty;
        public string BssMailOtpCode { get; set; } = string.Empty;   // refCode
        public string BssMailRefCode { get; set; } = string.Empty;   // otp
    }
}
