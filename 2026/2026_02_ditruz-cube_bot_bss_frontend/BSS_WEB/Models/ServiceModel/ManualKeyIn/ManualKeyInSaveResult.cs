namespace BSS_WEB.Models.ServiceModel.ManualKeyIn
{
    public class ManualKeyInSaveResult
    {
        public long ReconcileTranId { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
