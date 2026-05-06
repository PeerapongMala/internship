namespace BSS_WEB.Models.ServiceModel.Reconciliation
{
    public class ReconciliationScanResult
    {
        public long ReconciliationTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
