namespace BSS_WEB.Models.ServiceModel.Reconcile
{
    public class ReconcileScanResult
    {
        public long ReconcileTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
