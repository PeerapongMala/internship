namespace BSS_WEB.Models.Report
{
    public class reportCashPointCenterResponse
    {
        // ข้อมูลส่วนหัวรายงาน (Header)
        public string ReportTitle { get; set; } = "Cashpoint/Cashcenter Report";
        public DateTime WorkDate { get; set; }
        public DateTime PrintDate { get; set; } = DateTime.Now;
        public string MachineName { get; set; }
        public string DenominationType { get; set; } = "ทั้งหมด";
        public string Shift { get; set; } = "ทั้งวัน";
        public string CashType { get; set; }

        // ข้อมูลผู้รับผิดชอบ
        public string PreparedBy { get; set; }      // Operator-Prepare
        public string ReconciledBy { get; set; }    // Operator-Reconcile
        public string SorterBy { get; set; }        // Operator-Sorter
        public string SupervisorName { get; set; }

        // ส่วนของข้อมูลตารางที่จัดกลุ่มแล้ว
        public CashPointReportViewModel ReportData { get; set; }
    }

    public class CashPointReportViewModel
    {
        public List<InstitutionGroup> Institutions { get; set; }
        public TotalSummary GrandTotal { get; set; }
    }

    public class InstitutionGroup : TotalSummary
    {
        public string InstitutionName { get; set; }
        public List<ZoneGroup> Zones { get; set; }
    }

    public class ZoneGroup : TotalSummary
    {
        public string CashCenterName { get; set; }
        public string ZoneName { get; set; }
        public string CashPointName { get; set; }
        public List<DenominationGroup> Denominations { get; set; }
    }

    public class DenominationGroup : TotalSummary
    {
        public decimal Denomination { get; set; }
        public List<CashPointSummary> Details { get; set; }
    }

    public class CashPointCenterRecord
    {
        // ตัวระบุสำหรับการ Grouping
        public string InstitutionName { get; set; }
        public string CashCenterName { get; set; }
        public string ZoneName { get; set; }
        public string CashPointName { get; set; }
        public string BanknoteTypeName { get; set; }
        public decimal Denomination { get; set; }

        // คอลัมน์ตัวเลข (Data Columns)
        public int DestroyAmount { get; set; }     // ทำลาย (+)
        public int GoodAmount { get; set; }        // ดี (+)
        public int BadAmount { get; set; }         // เสีย (+)
        public int RejectAmount { get; set; }      // Reject (+)
        public int CounterfeitAmount { get; set; } // ปลอม (0)
        public int DamagedAmount { get; set; }     // ชำรุด (0)
        public int PreAdjustTotal { get; set; }    // รวมก่อนปรับ
        public int ShortAmount { get; set; }       // ขาด (+)
        public int OverAmount { get; set; }        // เกิน (-)
        public int FinalTotal { get; set; }        // รวมทั้งสิ้น
        public decimal FinalValue { get; set; }    // มูลค่าทั้งสิ้น
    }

    public class CashPointSummary : TotalSummary
    {
        // เก็บเฉพาะหัวใจสำคัญของแถวนั้นๆ
        public string CashCenterName { get; set; }
        public string ZoneName { get; set; }
        public string CashPointName { get; set; }

        // คอลัมน์ตัวเลข (Data Columns)
        public int DestroyAmount { get; set; }
        public int GoodAmount { get; set; }
        public int BadAmount { get; set; }
        public int RejectAmount { get; set; }
        public int CounterfeitAmount { get; set; }
        public int DamagedAmount { get; set; }
        public int PreAdjustTotal { get; set; }
        public int ShortAmount { get; set; }
        public int OverAmount { get; set; }
        public int FinalTotal { get; set; }
        public decimal FinalValue { get; set; }
    }

    public class TotalSummary
    {
        public int TotalDestroy { get; set; }
        public int TotalGood { get; set; }
        public int TotalBad { get; set; }
        public int TotalReject { get; set; }
        public int TotalCounterfeit { get; set; }
        public int TotalDamaged { get; set; }
        public int TotalPreAdjust { get; set; }
        public int TotalShort { get; set; }
        public int TotalOver { get; set; }
        public int TotalFinalAmount { get; set; }
        public decimal TotalValue { get; set; }
    }

}
