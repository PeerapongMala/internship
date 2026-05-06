namespace BSS_WEB.Models.Report
{
    public class reportContainerResponse
    {
        public string ReportTitle { get; set; } = "Container Report";
        public string PrintDate { get; set; }
        public string CountingDate { get; set; }
        public string MachineName { get; set; }
        public string Shift { get; set; }
        public string BankName { get; set; }
        public string NoteType { get; set; } // เช่น Unfit

        // รายชื่อ Operator
        public string OperatorPrepare { get; set; }
        public string OperatorSorter { get; set; }
        public string OperatorReconcile { get; set; }
        public string Supervisor { get; set; }

        // ข้อมูลตาราง
        public List<ContainerReportGroup> ContainerGroups { get; set; } = new();

        // ยอดรวมสรุปท้ายรายงาน (Grand Total)
        public ReportTotalRow GrandTotal { get; set; } = new();
    }

    public class ContainerReportGroup
    {
        public string ContainerBarcode { get; set; }
        public List<ContainerReportDetail> Details { get; set; } = new();

        // ยอดรวมเฉพาะภาชนะนี้ (Sub-total by Container)
        public ReportTotalRow ContainerTotal { get; set; } = new();
    }


    public class ContainerReportDetail
    {
        public string BankName { get; set; }
        public int Denomination { get; set; }
        public string Series { get; set; } // แบบ

        // จำนวนฉบับ
        public long GoodQty { get; set; }
        public long BadQty { get; set; }
        public long RejectQty { get; set; }
        public long DestroyQty { get; set; }
        public long CounterfeitQty { get; set; } // ปลอม
        public long MutilatedQty { get; set; }   // ชำรุด

        public long TotalBeforeAdjust { get; set; }
        public decimal ValueBeforeAdjust { get; set; }

        // ส่วนต่าง
        public int ShortQty { get; set; } // ขาด
        public int OverQty { get; set; }  // เกิน

        public long TotalAfterAdjust { get; set; }
        public decimal ValueAfterAdjust { get; set; }
    }

    // ใช้สำหรับบรรทัดสรุปยอด (Summary Rows)
    public class ReportTotalRow : ContainerReportDetail
    {
        public string Label { get; set; } // เช่น "รวม Unfit", "รวม ภาชนะ BM10001"
    }



}
