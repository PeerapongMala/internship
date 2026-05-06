namespace BSS_WEB.Models.ServiceModel.Reconsile
{
    public class ReconsileScanResult
    {
        public long ReconsileTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
