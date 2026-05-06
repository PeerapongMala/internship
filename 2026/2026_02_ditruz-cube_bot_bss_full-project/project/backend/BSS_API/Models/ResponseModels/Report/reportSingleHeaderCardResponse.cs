namespace BSS_API.Models
{
    public class reportSingleHeaderCardResponse
    {
        // ส่วนข้อมูลหัวรายงาน
        public string PrintDate { get; set; } = string.Empty;
        public string CountingDate { get; set; } = string.Empty;
        public string MachineName { get; set; } = string.Empty;
        public string BundleBarcode { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string CashCenter { get; set; } = string.Empty;
        public string CashPoint { get; set; } = string.Empty;
        public string Zone { get; set; } = string.Empty;
        public string CashType { get; set; } = string.Empty; // เช่น Unfit
        public string Shift { get; set; } = string.Empty;
        public string HeaderCardNo { get; set; } = string.Empty;
        public string PackBarcode { get; set; } = string.Empty;

        // ผู้รับผิดชอบ
        public string OperatorPrepare { get; set; } = string.Empty;
        public string OperatorReconcile { get; set; } = string.Empty;
        public string OperatorSorter { get; set; } = string.Empty;
        public string Supervisor { get; set; } = string.Empty;

        // ส่วนรายละเอียดในตาราง
        public List<SingleDenominationGroup> ReportDetails { get; set; } = new List<SingleDenominationGroup>();
    }


    public class SingleDenominationGroup
    {
        public string Denomination { get; set; } = string.Empty; // ชนิดราคา เช่น 20, 100, 1000
        public List<HeaderCardRowDetail> SeriesDetails { get; set; } = new List<HeaderCardRowDetail>();
    }

    public class HeaderCardRowDetail
    {
        public string Series { get; set; } = string.Empty; // แบบ เช่น 17P, 17, 16
        public int GoodAmount { get; set; }
        public int BadAmount { get; set; }
        public int RejectAmount { get; set; }
        public int DestroyAmount { get; set; }
        public int CounterfeitAmount { get; set; }
        public int DamagedAmount { get; set; }

        public int TotalBeforeAdjust { get; set; }
        public decimal ValueBeforeAdjust { get; set; }

        public int ShortAmount { get; set; } // ขาด (+)
        public int ExcessAmount { get; set; } // เกิน (-)

        public int TotalAfterAdjust { get; set; }
        public decimal TotalValueAfterAdjust { get; set; }
    }


}
