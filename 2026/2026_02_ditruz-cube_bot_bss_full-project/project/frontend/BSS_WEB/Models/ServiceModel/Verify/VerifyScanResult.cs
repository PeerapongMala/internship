namespace BSS_WEB.Models.ServiceModel.Verify
{
    public class VerifyScanResult
    {
        public long VerifyTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
