namespace BSS_WEB.Models.ServiceModel.Reconciliation
{
    public class ReconciliationHeaderCardDetailResult
    {
        public long ReconciliationTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public DateTime? Date { get; set; }
        public string? SorterName { get; set; }
        public string? ReconciliatorName { get; set; }
        public string? SortingMachineName { get; set; }
        public string? ShiftName { get; set; }
        public int? BundleNumber { get; set; }
        public bool HasMachineResult { get; set; }
        public List<ReconciliationPreparationBundleDetail>? Bundles { get; set; }
    }

    public class ReconciliationPreparationBundleDetail
    {
        public long PrepareId { get; set; }
        public string? HeaderCardCode { get; set; }
        public int DenomPrice { get; set; }
        public string? BankCode { get; set; }
        public string? BankName { get; set; }
        public string? CashpointName { get; set; }
        public int Qty { get; set; }
    }
}
