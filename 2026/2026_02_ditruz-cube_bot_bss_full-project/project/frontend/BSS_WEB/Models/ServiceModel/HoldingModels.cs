namespace BSS_WEB.Models.ServiceModel
{
    public class HoldingFilterModel
    {
        public int DepartmentId { get; set; }
        public int? ShiftId { get; set; }
        public int? MachineHdId { get; set; }
    }

    public class HoldingSummaryResult
    {
        public List<HoldingDenominationRowResult> Rows { get; set; } = new();
        public int TotalGoodDamagedDestroy { get; set; }
        public int TotalReject { get; set; }
        public int TotalCounterfeitDefect { get; set; }
        public int TotalExcess { get; set; }
        public int GrandTotal { get; set; }
    }

    public class HoldingDenominationRowResult
    {
        public int DenoPrice { get; set; }
        public string BnType { get; set; } = string.Empty;
        public string BnTypeCode { get; set; } = string.Empty;
        public string DenomSeries { get; set; } = string.Empty;
        public int Qty { get; set; }
    }
}
