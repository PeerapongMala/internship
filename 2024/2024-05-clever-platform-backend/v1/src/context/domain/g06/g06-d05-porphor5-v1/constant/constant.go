package constant

type SheetValueType int

var General SheetValueType = 0
var Subject SheetValueType = 1

type Status string

var (
	Active  = "active"
	Draft   = "draft"
	Enable  = "enable"
	Disable = "disable"
)

var True = true
var False = false

type EvaluationFormStatus string

var (
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
)

type Porphor5Category string

const (
	SubjectCategory      Porphor5Category = "รายวิชา"
	ReportCoverByGrade   Porphor5Category = "ปก ปพ.5 รายชั้น"
	ReportCoverBySubject Porphor5Category = "ปก ปพ.5 รายวิชา"
	StudentNames         Porphor5Category = "ชื่อนักเรียน"
	ParentInfo           Porphor5Category = "บิดา-มารดา"
	GuardianInfo         Porphor5Category = "ผู้ปกครอง"
	Attendance           Porphor5Category = "เวลาเรียน"
	NutritionSummary     Porphor5Category = "สรุปโภชนาการ"
	AcademicAchievement  Porphor5Category = "ผลสัมฤทธิ์ทางการเรียน"
	DesirableTraits      Porphor5Category = "คุณลักษณะอันพึงประสงค์"
	Competency           Porphor5Category = "สมรรถนะ"
	StudentDevelopment   Porphor5Category = "กิจกรรมพัฒนาผู้เรียน"
	NutritionalStatus    Porphor5Category = "ภาวะโภชนาการ"
)

const (
	FieldGrade        = "grade"
	FieldTotalScore   = "total_score"
	FieldPercentScore = "percent_score"
	FieldGradeStatus  = "grade_status"
)

const (
	Male   = "ช"
	Female = "ญ"
)

const (
	Passed     = "ผ"
	Failed     = "มผ"
	Good       = "ด"
	Excellent  = "ดย"
	Passed2    = "ผ2"
	Failed2    = "มผ2"
	Good2      = "ด2"
	Excellent2 = "ดย2"
)
