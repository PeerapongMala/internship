namespace BSS_API.Models.BssMail
{
    public class BssMailResponse
    {
        public string RefCode { get; set; }

        public int OtpExpireIn { get; set; }

        public bool IsSuccess { get; set; } = false;

        public string ResponseMessage { get; set; }

        public string BssMailSystemTypeCode { get; set; }
    }
}