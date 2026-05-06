namespace BSS_API.Models.BssMail
{
    using System.ComponentModel.DataAnnotations;

    public class BssMailRequest
    {
        [Required] public int UserSendId { get; set; }

        [Required] public int UserSendDepartmentId { get; set; }

        [Required] public int UserReceiveId { get; set; }

        [Required] public string BssMailSystemTypeCode { get; set; }

        #region Validate

        public string BssMailOtpCode { get; set; }

        public string BssMailRefCode { get; set; }

        #endregion Validate
    }
}