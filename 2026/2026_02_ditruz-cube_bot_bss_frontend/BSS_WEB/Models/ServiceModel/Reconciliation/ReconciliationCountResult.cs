namespace BSS_WEB.Models.ServiceModel.Reconciliation
{
    public class ReconciliationCountResult
    {
        public int TotalReconciled { get; set; }
        public int TotalPending { get; set; }
        public int TotalWarning { get; set; }
    }
}
