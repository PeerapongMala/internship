namespace BSS_WEB.Models.ServiceModel.Reconcile
{
    public class ReconcileHeaderCardDetailResult
    {
        public long ReconcileTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public DateTime? Date { get; set; }
        public string? SorterName { get; set; }
        public string? ReconciliatorName { get; set; }
        public string? SortingMachineName { get; set; }
        public string? ShiftName { get; set; }
    }
}
