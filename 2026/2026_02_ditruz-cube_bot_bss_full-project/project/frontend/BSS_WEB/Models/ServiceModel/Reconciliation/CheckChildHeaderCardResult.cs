namespace BSS_WEB.Models.ServiceModel.Reconciliation
{
    public class CheckChildHeaderCardResult
    {
        public bool Exists { get; set; }
        public bool HasMachineData { get; set; }
        public int? DenomPrice { get; set; }
        public string? BankName { get; set; }
        public string? CashpointName { get; set; }
    }
}
