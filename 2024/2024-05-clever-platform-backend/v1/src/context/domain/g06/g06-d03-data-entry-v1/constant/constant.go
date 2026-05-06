package constant

type SheetValueType int

var General SheetValueType = 0
var Subject SheetValueType = 1

type Status string // sheet status

var (
	Enable  = "enable"
	Sent    = "sent"
	Approve = "approve"
)

var True = true
var False = false

type EvaluationSheetStatus string

var (
	ESDraft    EvaluationSheetStatus = "draft"    //เมื่อถูกกดบันทึก ที่ step 1,2,3 ใน wizard จะถูกบันทึกเป็น แบบร่าง
	ESEnabled  EvaluationSheetStatus = "enabled"  //เมื่อกด เผยแพร่ ใน step สุดท้าย จะถูกเปลี่ยนเป็นสถานะ ใช้งาน(ครูที่มีสิทธิ์การเข้าถึงจะเห็นใบประเมินและเข้ากรอกคะแนนได้)
	ESDisabled EvaluationSheetStatus = "disabled" //เมื่อถูกกด จัดเก็บ (action จากในตาราง) จะถูกเปลี่ยนเป็นสถานะ ไม่ใช้งาน
	ESSent     EvaluationSheetStatus = "sent"     //เมื่อครูที่สามารถกรอกคะแนน กด ส่งข้มูล จะถูกเปลี่ยนเป็นสถานะ ส่งข้อมูลแล้ว(ล็อกใบประเมินโดยอัตโนมัติ ถ้าถูกกดแก้ใขในหน้ากรอกใบประเมินก็จะถูกเปลี่ยนกลับเป็น สถานะ ใช้งาน และปลดล็อกใบประเมิน)
	ESApprove  EvaluationSheetStatus = "approve"  //ตอนกดสร้างรายงาน
)

const (
	EvalPrePostTest       = "ด่านทดสอบก่อนเรียน"
	EvalSubLessonPostTest = "ด่านทดสอบบทเรียนย่อยก่อนเรียน"
	EvalEasy              = "ด่านง่าย"
	EvalMedium            = "ด่านปานกลาง"
	EvalHard              = "ด่านยาก"
	EvalAll               = "ด่านรวม ง่าย ปานกลาง และยาก"
)

var EvalList = []string{EvalPrePostTest, EvalSubLessonPostTest, EvalEasy, EvalMedium, EvalHard, EvalAll}
