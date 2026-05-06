namespace BSS_WEB.Models.ServiceModel.Reconcile
{
    public class MachineHeaderCardResult
    {
        public long MachineHdId { get; set; }
        public string HeaderCardCode { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public int? DenominationPrice { get; set; }
        public int? MachineQty { get; set; }
        public string? DepositId { get; set; }
        public string? IsReject { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsWarning { get; set; }
        public bool HasAlert { get; set; }
        public string AlertMessage { get; set; } = string.Empty;
    }
}
