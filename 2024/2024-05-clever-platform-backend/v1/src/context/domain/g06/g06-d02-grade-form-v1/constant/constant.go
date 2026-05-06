package constant

var GradeEvaluationFormCSVHeader = []string{"No", "Id(ห้ามแก้)", "TemplateId(ห้ามแก้,จำเป็น)", "TemplateName", "ปีการศึกษา", "ชั้นปี", "ห้อง", "เทอม", "ล็อคใบเกรด", "สถานะ"}

type SheetValueType int

var General SheetValueType = 0
var Subject SheetValueType = 1

type Status string

var (
	Active = "active"
)

var True = true
var False = false

type EvaluationFormStatus string

var (
	EFDraft           EvaluationFormStatus = "draft"
	EFInProgress      EvaluationFormStatus = "in_progress"
	EFReportAvailable EvaluationFormStatus = "report_available"
	EFReported        EvaluationFormStatus = "reported"
	EFDisabled        EvaluationFormStatus = "disabled"
)

type EvaluationSheetStatus string

var (
	ESDraft    EvaluationSheetStatus = "draft"    //เมื่อถูกกดบันทึก ที่ step 1,2,3 ใน wizard จะถูกบันทึกเป็น แบบร่าง
	ESEnabled  EvaluationSheetStatus = "enabled"  //เมื่อกด เผยแพร่ ใน step สุดท้าย จะถูกเปลี่ยนเป็นสถานะ ใช้งาน(ครูที่มีสิทธิ์การเข้าถึงจะเห็นใบประเมินและเข้ากรอกคะแนนได้)
	ESDisabled EvaluationSheetStatus = "disabled" //เมื่อถูกกด จัดเก็บ (action จากในตาราง) จะถูกเปลี่ยนเป็นสถานะ ไม่ใช้งาน
	ESSent     EvaluationSheetStatus = "sent"     //เมื่อครูที่สามารถกรอกคะแนน กด ส่งข้มูล จะถูกเปลี่ยนเป็นสถานะ ส่งข้อมูลแล้ว(ล็อกใบประเมินโดยอัตโนมัติ ถ้าถูกกดแก้ใขในหน้ากรอกใบประเมินก็จะถูกเปลี่ยนกลับเป็น สถานะ ใช้งาน และปลดล็อกใบประเมิน)
	ESApprove  EvaluationSheetStatus = "approve"  //ตอนกดสร้างรายงาน
)
