namespace BSS_WEB.Core.Constants
{
    [Flags]
    public enum BssStatusEnum
    {
        None = 0,

        /// <summary>
        /// ลงทะเบียน
        /// </summary>
        Registered = 1 << 0,

        /// <summary>
        /// สร้างใบส่งมอบ
        /// </summary>
        DeliveredNote = 1 << 1,

        /// <summary>
        /// ส่งมอบ
        /// </summary>
        Delivered = 1 << 2,

        /// <summary>
        /// แก้ไขรายการส่งกลับ
        /// </summary>
        CorrectReturn = 1 << 3,

        /// <summary>
        /// ไม่รับมอบ
        /// </summary>
        NotAccepted = 1 << 4,

        /// <summary>
        /// รับมอบ
        /// </summary>
        Received = 1 << 5,

        /// <summary>
        /// สิ้นสุด
        /// </summary>
        Finished = 1 << 6,

        /// <summary>
        /// ลบข้อมูลภาชนะ
        /// </summary>
        DeletedPrePrepare = 1 << 7,

        /// <summary>
        /// เตรียมธนบัตร
        /// </summary>
        Prepared = 1 << 8,

        /// <summary>
        /// ยกเลิกเตรียมธนบัตร
        /// </summary>
        CancelPrepared = 1 << 9,

        /// <summary>
        /// รายการรอกระทบยอด
        /// </summary>
        Reconciliation = 1 << 10,

        /// <summary>
        /// ยกเลิกรายการรอกระทบยอด
        /// </summary>
        CancelReconciliation = 1 << 11,

        /// <summary>
        /// กระทบยอดแล้ว
        /// </summary>
        Reconciled = 1 << 12,

        /// <summary>
        /// Auto Selling
        /// </summary>
        AutoSelling = 1 << 13,

        /// <summary>
        /// Adjust Offset
        /// </summary>
        AdjustOffset = 1 << 14,

        /// <summary>
        /// อนุมัติ
        /// </summary>
        Approved = 1 << 15,

        /// <summary>
        /// Verify
        /// </summary>
        Verify = 1 << 16,

        /// <summary>
        /// ส่งผลนับคัดเข้า CBMS
        /// </summary>
        SendToCBMS = 1 << 17,

        /// <summary>
        /// ยืนยันผลนับคัด
        /// </summary>
        Confirm = 1 << 18,

        /// <summary>
        /// แก้ไขข้อมูลผลนับคัด
        /// </summary>
        Edited = 1 << 19,

        /// <summary>
        /// ไม่อนุมัติแก้ไขข้อมูลผลนับคัด
        /// </summary>
        DeniedEdited = 1 << 20,

        /// <summary>
        /// ยกเลิกผลนับคัดที่แก้ไข
        /// </summary>
        CancelSentDeniedEdited = 1 << 21,

        /// <summary>
        /// ยกเลิกส่งผลนับคัด
        /// </summary>
        CancelSent = 1 << 22,

        /// <summary>
        /// แก้ไขข้อมูล Manual Key-in
        /// </summary>
        ManualKeyIn = 1 << 23,

        /// <summary>
        /// ไม่อนุมัติผลแก้ไข Manual Key-in
        /// </summary>
        DeniedManualKeyIn = 1 << 24,

        /// <summary>
        /// ยกเลิกส่งผลนับคัด Manual Key-in
        /// </summary>
        CancelSentManualKeyIn = 1 << 25,

        /// <summary>
        /// แก้ไขข้อมูลที่อนุมัติแล้ว
        /// </summary>
        EditedApproved = 1 << 26,

        /// <summary>
        /// ไม่อนุมัติผลแก้ไขอนุมัติแล้ว
        /// </summary>
        DeniedEditedApproved = 1 << 27,

        /// <summary>
        /// ยกเลิกผลนับคัดที่อนุมัติแล้ว
        /// </summary>
        CancelSentDeniedApproved = 1 << 28,

        /// <summary>
        /// อนุมัติยกเลิกส่งผลนับคัด
        /// </summary>
        ApprovedCancel = 1 << 29,

        /// <summary>
        /// ส่งคืน
        /// </summary>
        Returned = 1 << 30,

        /// <summary>
        /// กำลังดำเนินการ
        /// </summary>
        Process = 1 << 31,
    }

    public abstract class BssStatusConstants
    {
        /// <summary>
        /// ลงทะเบียน
        /// </summary>
        public const int Registered = 1;

        /// <summary>
        /// สร้างใบส่งมอบ
        /// </summary>
        public const int DeliveredNote = 2;

        /// <summary>
        /// ส่งมอบ
        /// </summary>
        public const int Delivered = 3;

        /// <summary>
        /// แก้ไขรายการส่งกลับ
        /// </summary>
        public const int CorrectReturn = 4;

        /// <summary>
        /// ไม่รับมอบ
        /// </summary>
        public const int NotAccepted = 5;

        /// <summary>
        /// รับมอบ
        /// </summary>
        public const int Received = 6;

        /// <summary>
        /// สิ้นสุด
        /// </summary>
        public const int Finished = 7;

        /// <summary>
        /// ลบข้อมูลภาชนะ
        /// </summary>
        public const int DeletedPrePrepare = 8;

        /// <summary>
        /// เตรียมธนบัตร
        /// </summary>
        public const int Prepared = 9;

        /// <summary>
        /// ยกเลิกเตรียมธนบัตร
        /// </summary>
        public const int CancelPrepared = 10;

        /// <summary>
        /// รายการรอกระทบยอด
        /// </summary>
        public const int Reconciliation = 11;

        /// <summary>
        /// ยกเลิกรายการรอกระทบยอด
        /// </summary>
        public const int CancelReconciliation = 12;

        /// <summary>
        /// กระทบยอดแล้ว
        /// </summary>
        public const int Reconciled = 13;

        /// <summary>
        /// Auto Selling
        /// </summary>
        public const int AutoSelling = 14;

        /// <summary>
        /// Adjust Offset
        /// </summary>
        public const int AdjustOffset = 15;

        /// <summary>
        /// อนุมัติ
        /// </summary>
        public const int Approved = 16;

        /// <summary>
        /// Verify
        /// </summary>
        public const int Verify = 17;

        /// <summary>
        /// ส่งผลนับคัดเข้า CBMS
        /// </summary>
        public const int SendToCBMS = 18;

        /// <summary>
        /// ยืนยันผลนับคัด
        /// </summary>
        public const int Confirm = 19;

        /// <summary>
        /// แก้ไขข้อมูลผลนับคัด
        /// </summary>
        public const int Edited = 20;

        /// <summary>
        /// ไม่อนุมัติแก้ไขข้อมูลผลนับคัด
        /// </summary>
        public const int DeniedEdited = 21;

        /// <summary>
        /// ยกเลิกผลนับคัดที่แก้ไข
        /// </summary>
        public const int CancelSentDeniedEdited = 22;

        /// <summary>
        /// ยกเลิกส่งผลนับคัด
        /// </summary>
        public const int CancelSent = 23;

        /// <summary>
        /// แก้ไขข้อมูล Manual Key-in
        /// </summary>
        public const int ManualKeyIn = 24;

        /// <summary>
        /// ไม่อนุมัติผลแก้ไข Manual Key-in
        /// </summary>
        public const int DeniedManualKeyIn = 25;

        /// <summary>
        /// ยกเลิกส่งผลนับคัด Manual Key-in
        /// </summary>
        public const int CancelSentManualKeyIn = 26;

        /// <summary>
        /// แก้ไขข้อมูลที่อนุมัติแล้ว
        /// </summary>
        public const int EditedApproved = 27;

        /// <summary>
        /// ไม่อนุมัติผลแก้ไขอนุมัติแล้ว
        /// </summary>
        public const int DeniedEditedApproved = 28;

        /// <summary>
        /// ยกเลิกผลนับคัดที่อนุมัติแล้ว
        /// </summary>
        public const int CancelSentDeniedApproved = 29;

        /// <summary>
        /// อนุมัติยกเลิกส่งผลนับคัด
        /// </summary>
        public const int ApprovedCancel = 30;

        /// <summary>
        /// ส่งคืน
        /// </summary>
        public const int Returned = 31;

        /// <summary>
        /// กำลังดำเนินการ
        /// </summary>
        public const int Process = 32;
    }

    public abstract class BssStatusCodeConstants
    {
        /// <summary>
        /// ลงทะเบียน
        /// </summary>
        public const string Registered = "01";

        /// <summary>
        /// สร้างใบส่งมอบ
        /// </summary>
        public const string DeliveredNote = "02";

        /// <summary>
        /// ส่งมอบ
        /// </summary>
        public const string Delivered = "03";

        /// <summary>
        /// แก้ไขรายการส่งกลับ
        /// </summary>
        public const string CorrectReturn = "04";

        /// <summary>
        /// ไม่รับมอบ
        /// </summary>
        public const string NotAccepted = "05";

        /// <summary>
        /// รับมอบ
        /// </summary>
        public const string Received = "06";

        /// <summary>
        /// สิ้นสุด
        /// </summary>
        public const string Finished = "07";

        /// <summary>
        /// ลบข้อมูลภาชนะ
        /// </summary>
        public const string DeletedPrePrepare = "08";

        /// <summary>
        /// เตรียมธนบัตร
        /// </summary>
        public const string Prepared = "09";

        /// <summary>
        /// ยกเลิกเตรียมธนบัตร
        /// </summary>
        public const string CancelPrepared = "10";

        /// <summary>
        /// รายการรอกระทบยอด
        /// </summary>
        public const string Reconciliation = "11";

        /// <summary>
        /// ยกเลิกรายการรอกระทบยอด
        /// </summary>
        public const string CancelReconciliation = "12";

        /// <summary>
        /// กระทบยอดแล้ว
        /// </summary>
        public const string Reconciled = "13";

        /// <summary>
        /// Auto Selling
        /// </summary>
        public const string AutoSelling = "14";

        /// <summary>
        /// Adjust Offset
        /// </summary>
        public const string AdjustOffset = "15";

        /// <summary>
        /// อนุมัติ
        /// </summary>
        public const string Approved = "16";

        /// <summary>
        /// Verify
        /// </summary>
        public const string Verify = "17";

        /// <summary>
        /// ส่งผลนับคัดเข้า CBMS
        /// </summary>
        public const string SendToCBMS = "18";

        /// <summary>
        /// ยืนยันผลนับคัด
        /// </summary>
        public const string Confirm = "19";

        /// <summary>
        /// แก้ไขข้อมูลผลนับคัด
        /// </summary>
        public const string Edited = "20";

        /// <summary>
        /// ไม่อนุมัติแก้ไขข้อมูลผลนับคัด
        /// </summary>
        public const string DeniedEdited = "21";

        /// <summary>
        /// ยกเลิกผลนับคัดที่แก้ไข
        /// </summary>
        public const string CancelSentDeniedEdited = "22";

        /// <summary>
        /// ยกเลิกส่งผลนับคัด
        /// </summary>
        public const string CancelSent = "23";

        /// <summary>
        /// แก้ไขข้อมูล Manual Key-in
        /// </summary>
        public const string ManualKeyIn = "24";

        /// <summary>
        /// ไม่อนุมัติผลแก้ไข Manual Key-in
        /// </summary>
        public const string DeniedManualKeyIn = "25";

        /// <summary>
        /// ยกเลิกส่งผลนับคัด Manual Key-in
        /// </summary>
        public const string CancelSentManualKeyIn = "26";

        /// <summary>
        /// แก้ไขข้อมูลที่อนุมัติแล้ว
        /// </summary>
        public const string EditedApproved = "27";

        /// <summary>
        /// ไม่อนุมัติผลแก้ไขอนุมัติแล้ว
        /// </summary>
        public const string DeniedEditedApproved = "28";

        /// <summary>
        /// ยกเลิกผลนับคัดที่อนุมัติแล้ว
        /// </summary>
        public const string CancelSentDeniedApproved = "29";

        /// <summary>
        /// อนุมัติยกเลิกส่งผลนับคัด
        /// </summary>
        public const string ApprovedCancel = "30";

        /// <summary>
        /// ส่งคืน
        /// </summary>
        public const string Returned = "31";

        /// <summary>
        /// กำลังดำเนินการ
        /// </summary>
        public const string Process = "32";
    }
}
