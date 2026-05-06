namespace BSS_WEB.Models.ServiceModel.Reconcile
{
    public class ReconcileCountResult
    {
        public int TotalReconciled { get; set; }
        public int TotalPending { get; set; }
        public int TotalWarning { get; set; }
    }
}
