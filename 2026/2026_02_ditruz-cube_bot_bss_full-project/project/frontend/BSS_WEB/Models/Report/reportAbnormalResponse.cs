namespace BSS_WEB.Models.Report
{
    public class reportAbnormalResponse
    {
        public string ReportTitle { get; set; } = "Abnormal Report";
        public string PrintDate { get; set; }
        public string CountingDate { get; set; }
        public string MachineName { get; set; } // จาก Header หลัก
        public string BankName { get; set; }    // จาก Header หลัก
        public string NoteType { get; set; }    // เช่น Unfit
        public string Shift { get; set; }
        public string HeaderCard { get; set; }
        public string CashCenter { get; set; }

        // รายชื่อเจ้าหน้าที่
        public string OperatorPrepare { get; set; }
        public string OperatorSorter { get; set; }
        public string OperatorReconcile { get; set; }
        public string Supervisor { get; set; }

        // รายการแบ่งตามเครื่องจักร (เพื่อทำ Rowspan)
        public List<MachineAbnormalGroup> MachineGroups { get; set; } = new();

        // ยอดรวมสรุปท้ายรายงาน
        public AbnormalTotalRow GrandTotal { get; set; } = new();
    }

    public class MachineAbnormalGroup
    {
        public string MachineId { get; set; } // เช่น M7-1
        public List<AbnormalReportDetail> Details { get; set; } = new();

        // จำนวนแถวสำหรับทำ rowspan (Details.Count)
        public int RowSpan => Details.Count;
    }

    public class AbnormalReportDetail
    {
        // เวลาและข้อมูลระบุตัวตน
        public string PrepareTime { get; set; }
        public string SortingTime { get; set; }
        public string ReconcileTime { get; set; }
        public string HeaderCard { get; set; }
        public string AbnormalType { get; set; } // เช่น Manual Key-in, Adjust Offset, Edited
        public string BankName { get; set; }
        public string CashCenter { get; set; }
        public int Denomination { get; set; }

        // จำนวนฉบับ (Quantity)
        public long GoodQty { get; set; }
        public long BadQty { get; set; }
        public long RejectQty { get; set; }
        public long DestroyQty { get; set; }
        public long CounterfeitQty { get; set; } // ปลอม
        public long MutilatedQty { get; set; }   // ชำรุด

        // ข้อมูลการคำนวณ
        public long TotalBeforeAdjust { get; set; }
        public decimal ValueBeforeAdjust { get; set; }
        public int ShortQty { get; set; } // ขาด
        public int OverQty { get; set; }  // เกิน
        public long TotalAfterAdjust { get; set; }
        public decimal ValueAfterAdjust { get; set; }
    }

    public class AbnormalTotalRow : AbnormalReportDetail
    {
        public string SummaryLabel { get; set; } // เช่น "รวมทั้งหมด"
    }



}
