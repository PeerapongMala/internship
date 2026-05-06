namespace BSS_WEB.Models.ServiceModel.Reconcile
{
    public class PrepareHeaderCardResult
    {
        public long PrepareId { get; set; }
        public string HeaderCardCode { get; set; } = string.Empty;
        public DateTime PrepareDate { get; set; }
        public int? DenominationPrice { get; set; }
        public int DenoId { get; set; }
    }
}
