package constant

type ScoreEvaluationType string

const (
	AcademicCriteria ScoreEvaluationType = "ACADEMIC_CRITERIA" // ใช้เกณฑ์ของนักวิชาการ
	TeacherCriteria  ScoreEvaluationType = "TEACHER_CRITERIA"  // ใช้เกณฑ์ของครู
	NoCriteria       ScoreEvaluationType = "NO_CRITERIA"       // กรอกคะแนนไม่ใช้เกณฑ์
)
