const BSSStatusEnum = Object.freeze({
    Registered: 1, // ลงทะเบียน
    DeliveredNote: 2, // สร้างใบส่งมอบ
    Delivered: 3, // ส่งมอบ
    CorrectReturn: 4, // แก้ไขรายการส่งกลับ
    NotAccepted: 5, // ไม่รับมอบ
    Received: 6, // รับมอบ
    Finished: 7, // สิ้นสุด
    DeletedPrePrepare: 8, // ลบข้อมูลภาชนะ
    Prepared: 9, // เตรียมธนบัตร
    CancelPrepared: 10, // ยกเลิกเตรียมธนบัตร
    Reconciliation: 11, // รายการรอกระทบยอด
    CancelReconciliation: 12, // ยกเลิกรายการรอกระทบยอด
    Reconciled: 13, // กระทบยอดแล้ว
    AutoSelling: 14, // Auto Selling
    AdjustOffset: 15, // Adjust Offset
    Approved: 16, // Approved
    Verify: 17, // Verify
    SendToCBMS: 18, // ส่งผลนับคัดเข้า CBMS
    Confirm: 19, // Confirm
    Edited: 20, // แก้ไขข้อมูลผลนับคัด
    DeniedEdited: 21, // ไม่อนุมัติแก้ไขข้อมูลผลนับคัด
    CancelSentDeniedEdited: 22, // ยกเลิกผลนับคัดที่แก้ไข
    CancelSent: 23, // ยกเลิกส่งผลนับคัด
    ManualKeyIn: 24, // แก้ไขข้อมูล Manual Key-in
    DeniedManualKeyIn: 25, // ไม่อนุมัติผลแก้ไข Manual Key-in
    CancelSentManualKeyIn: 26, // ยกเลิกส่งผลนับคัด Manual Key-in
    EditedApproved: 27, // แก้ไขข้อมูลที่อนุมัติแล้ว
    DeniedEditedApproved: 28, // ไม่อนุมัติผลแก้ไขอนุมัติแล้ว
    CancelSentDeniedApproved: 29, // ยกเลิกผลนับคัดที่อนุมัติแล้ว
    ApprovedCancel: 30, // อนุมัติยกเลิกส่งผลนับคัด
    Returned: 31, // ส่งคืน
    Process: 32 // กำลังดำเนินการ
});