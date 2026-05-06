namespace BSS_WEB.Models.ServiceModel.ManualKeyIn
{
    public class ManualKeyInHeaderCardInfoResult
    {
        public long PrepareId { get; set; }
        public string? HeaderCardCode { get; set; }
        public DateTime? Date { get; set; }
        public string? BarcodePack { get; set; }
        public string? BarcodeBundle { get; set; }
        public string? BankName { get; set; }
        public string? CashpointName { get; set; }
        public DateTime? PrepareDate { get; set; }
        public DateTime? CountDate { get; set; }
        public string? PrepareName { get; set; }
        public string? SorterName { get; set; }
        public string? ReconcileName { get; set; }
        public string? SupervisorName { get; set; }
        public int DepartmentId { get; set; }
        public int MachineHdId { get; set; }
        public string? MachineName { get; set; }
        public int ShiftId { get; set; }
        public string? ShiftName { get; set; }
        public int? SorterId { get; set; }
        public int StatusId { get; set; }
        public string? StatusName { get; set; }
    }
}
