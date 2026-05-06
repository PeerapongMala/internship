export enum EEvaluationFormStatus {
  ENABLED = 'enabled',
  IN_PROGRESS = 'in_progress',
  REPORT_AVAILABLE = 'report_available',
  REPORTED = 'reported',
  DISABLED = 'disabled',
  DRAFT = 'draft',
}

export enum EEvaluationSheetStatus {
  DRAFT = 'draft', // เมื่อถูกกดบันทึก ที่ step 1,2,3 ใน wizard จะถูกบันทึกเป็น แบบร่าง
  ENABLED = 'enabled', // เมื่อกด เผยแพร่ ใน step สุดท้าย จะถูกเปลี่ยนเป็นสถานะ ใช้งาน(ครูที่มีสิทธิ์การเข้าถึงจะเห็นใบประเมินและเข้ากรอกคะแนนได้)
  DISABLED = 'disabled', // เมื่อถูกกด จัดเก็บ (action จากในตาราง) จะถูกเปลี่ยนเป็นสถานะ ไม่ใช้งาน
  SENT = 'sent', // เมื่อครูที่สามารถกรอกคะแนน กด ส่งข้มูล จะถูกเปลี่ยนเป็นสถานะ ส่งข้อมูลแล้ว(ล็อกใบประเมินโดยอัตโนมัติ ถ้าถูกกดแก้ใขในหน้ากรอกใบประเมินก็จะถูกเปลี่ยนกลับเป็น สถานะ ใช้งาน และปลดล็อกใบประเมิน)
  APPROVE = 'approve', // ตอนกดสร้างรายงาน
}

export enum EEvaluationFormType {
  GENERAL_EVALUATION = 'GENERAL_EVALUATION',
  SUBJECT = 'SUBJECT',
}

export enum EResponsibleTeacherType {
  TEACHER = 'teacher',
  OTHER = 'other',
}
