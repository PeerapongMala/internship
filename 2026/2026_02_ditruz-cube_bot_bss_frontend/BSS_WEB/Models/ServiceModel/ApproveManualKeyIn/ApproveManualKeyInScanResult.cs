namespace BSS_WEB.Models.ServiceModel.ApproveManualKeyIn
{
    public class ApproveManualKeyInScanResult
    {
        public long ApproveManualKeyInTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
