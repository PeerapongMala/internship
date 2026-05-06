namespace BSS_API.Models
{
    public class reportCashPointCenterRequest
    {
        public int RequestByUserId { get; set; } = 0;
        public int DepartmentId { get; set; } = 0;
        public string MachineId { get; set; } = "all";
        public string Date { get; set; }
        public string InstitutionId { get; set; } = "all";
        public string CashCenterId { get; set; } = "all";
        public string ZoneId { get; set; } = "all";
        public string CashPointId { get; set; } = "all";
        public string CashTypeId { get; set; }
        public string DenominationId { get; set; } = "all";
        public string Shift { get; set; } = "SHIFT04";
    }
}
