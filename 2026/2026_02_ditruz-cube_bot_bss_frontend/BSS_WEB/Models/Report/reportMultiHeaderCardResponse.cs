namespace BSS_WEB.Models.Report
{
    public class reportMultiHeaderCardResponse
    {
        public string PrintDate { get; set; }
        public string CountingDate { get; set; }
        public string MachineName { get; set; }
        public string OperatorPrepare { get; set; }
        public string OperatorReconcile { get; set; }
        public string ShiftType { get; set; } // เช่น ทั้งวัน
        public string BanknoteType { get; set; } // เช่น Unfit
        public string OperatorSorter { get; set; }
        public string Supervisor { get; set; }

        // รายการข้อมูลแยกตาม Shift
        public List<ShiftGroup> Shifts { get; set; } = new List<ShiftGroup>();

        // ยอดรวมทั้งหมด (Grand Total) ท้ายรายงาน
        public ReportTotal GrandTotal { get; set; }
    }

    public class ShiftGroup
    {
        public string ShiftName { get; set; } // เช่น นอกเวลาทำการ, เช้า, บ่าย
        public List<HeaderCardItem> Items { get; set; } = new List<HeaderCardItem>();

        // ยอดรวมประจำ Shift (บรรทัดสีฟ้าอ่อนใน HTML)
        public ReportTotal ShiftTotal { get; set; }
    }

    public class HeaderCardItem
    {
        public int Denomination { get; set; } // ชนิดราคา
        public string HeadCardNo { get; set; }
        public string PrepareTime { get; set; }
        public string CountingTime { get; set; }
        public string ReconcileTime { get; set; }

        // จำนวนธนบัตรจำแนกประเภท
        public int GoodQty { get; set; }
        public int BadQty { get; set; }
        public int RejectQty { get; set; }
        public int DestroyQty { get; set; }
        public int FakeQty { get; set; }
        public int DamagedQty { get; set; }

        // สรุปก่อนปรับปรุง
        public int TotalBeforeAdjust { get; set; }
        public decimal ValueBeforeAdjust { get; set; }

        // รายการปรับปรุง
        public int ShortQty { get; set; } // ขาด
        public int OverQty { get; set; }  // เกิน

        // สรุปหลังปรับปรุง
        public int TotalAfterAdjust { get; set; }
        public decimal ValueAfterAdjust { get; set; }

        // ตัวช่วยสำหรับ Frontend (UI Logic)
        public int DenominationRowSpan { get; set; } // สำหรับจัดการ rowspan ในตาราง
    }

    public class ReportTotal
    {
        public int TotalGood { get; set; }
        public int TotalBad { get; set; }
        public int TotalReject { get; set; }
        public int TotalDestroy { get; set; }
        public int TotalFake { get; set; }
        public int TotalDamaged { get; set; }
        public int GrandTotalBefore { get; set; }
        public decimal GrandValueBefore { get; set; }
        public int TotalShort { get; set; }
        public int TotalOver { get; set; }
        public int GrandTotalAfter { get; set; }
        public decimal GrandValueAfter { get; set; }
    }


}
