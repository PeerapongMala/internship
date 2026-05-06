namespace BSS_API.Models
{
  
    // Class หลักสำหรับ Bank Summary Report
    public class reportBankSummaryResponse
    {
        public string ReportTitle { get; set; } = "Bank Summary Report";
        public string MachineName { get; set; }
        public string PreparedBy { get; set; }
        public string ReconciledBy { get; set; }
        public string InstitutionName { get; set; }
        public string BranchName { get; set; }
        public string DenominationType { get; set; }
        public DateTime PrintDate { get; set; }
        public DateTime WorkDate { get; set; }
        public string OperatorName { get; set; }
        public string SupervisorName { get; set; }
        public string Shift { get; set; }

        public List<BankDetail> BankSummaries { get; set; }
        public FinancialMetrics GrandTotal { get; set; }
    }

    // ข้อมูล Metric พื้นฐาน
    public class FinancialMetrics
    {
        public long GoodQty { get; set; }
        public long BadQty { get; set; }
        public long RejectQty { get; set; }
        public long DestroyQty { get; set; }
        public long CounterfeitQty { get; set; }
        public long MutilatedQty { get; set; }
        public long TotalQtyBeforeAdjust { get; set; }
        public decimal TotalValueBeforeAdjust { get; set; }
        public long ShortQty { get; set; }
        public long ExcessQty { get; set; }
        public long TotalQtyAfterAdjust { get; set; }
        public decimal TotalValueAfterAdjust { get; set; }
    }

    // รายละเอียดธนาคาร
    public class BankDetail : FinancialMetrics
    {
        public string BankName { get; set; }
        public List<DenomDetail> Denominations { get; set; }
    }

    // รายละเอียดชนิดราคา
    public class DenomDetail : FinancialMetrics
    {
        public string DenominationValue { get; set; }
        public string ModelSeries { get; set; }
    }
}
