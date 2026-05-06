namespace BSS_API.Models.BssMail
{
    using MimeKit;

    public class BssMimeMessage : MimeMessage
    {
        public string RefCode { get; set; }

        public string OtpCode { get; set; }

        public string OriginalBodyMessage { get; set; }
    }
}