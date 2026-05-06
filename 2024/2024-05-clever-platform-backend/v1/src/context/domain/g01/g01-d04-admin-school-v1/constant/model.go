package constant

import "time"

type AnnouncerFilter struct {
	SchoolId  int        `query:"school_id"`
	FirstName string     `query:"first_name"`
	LastName  string     `query:"last_name"`
	Status    string     `query:"status"`
	StartDate *time.Time `query:"start_date"`
	EndDate   *time.Time `query:"end_date"`
}

type ObserverFilter struct {
	Id               string     `query:"id"`
	Title            string     `query:"title"`
	FirstName        string     `query:"first_name"`
	LastName         string     `query:"last_name"`
	Email            string     `query:"email"`
	ObserverAccessId int        `query:"observer_access_id"`
	SchoolId         int        `query:"school_id"`
	Status           string     `query:"status"`
	StartDate        *time.Time `query:"start_date"`
	EndDate          *time.Time `query:"end_date"`
}

type TeacherFilter struct {
	Id             string `query:"id"`
	Title          string `query:"title"`
	FirstName      string `query:"first_name"`
	LastName       string `query:"last_name"`
	Email          string `query:"email"`
	Status         string `query:"status"`
	SchoolId       int    `query:"school_id"`
	Search         string `query:"search"`
	GradeSubjectId int    `query:"grade_subject_id"`
	TeacherAccess  int    `query:"teacher_access"`
}

type StudentFilter struct {
	Id        string `query:"id"`
	SchoolId  int
	StudentId string     `query:"student_id"`
	Title     string     `query:"title"`
	FirstName string     `query:"first_name"`
	LastName  string     `query:"last_name"`
	Email     string     `query:"email"`
	Status    string     `query:"status"`
	StartDate *time.Time `query:"start_date"`
	EndDate   *time.Time `query:"end_date"`
}

type UserBulkEditItem struct {
	UserId string `json:"user_id" validate:"required"`
	Status string `json:"status" validate:"required"`
}

type LessonPlayLogFilter struct {
	StartDate         string `query:"start_date"`
	EndDate           string `query:"end_date"`
	AcademicYear      int    `query:"academic_year"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	SubjectId         int    `query:"subject_id"`
	LessonId          int    `query:"lesson_id"`
	CurriculumGroup   string `query:"curriculum_group"`
	Subject           string `query:"subject"`
	Lesson            string `query:"lesson"`
}

type CurriculumGroupFilter struct {
	AcademicYear string `query:"academic_year"`
}

type SubjectFilter struct {
	AcademicYear      int `query:"academic_year"`
	CurriculumGroupId int `query:"curriculum_group_id"`
}

type LessonFilter struct {
	AcademicYear      int `query:"academic_year"`
	CurriculumGroupId int `query:"curriculum_group_id"`
	SubjectId         int `query:"subject_id"`
}

type SubLessonFilter struct {
	LessonId int `query:"lesson_id"`
}

type TeacherNoteFilter struct {
	StartDate         string `query:"start_date"`
	EndDate           string `query:"end_date"`
	AcademicYear      int    `query:"academic_year"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	SubjectId         int    `query:"subject_id"`
	LessonId          int    `query:"lesson_id"`
	SubLessonId       int    `query:"sub_lesson_id"`
}

var StudentCsvHeader = []string{"No", "Id(ห้ามแก้)", "อีเมล", "คำนำหน้า (บังคับ)", "ชื่อ (บังคับ)", "นามสกุล (บังคับ)", "เลขบัตรประชาชน (บังคับ, ห้ามซ้ำ)", "สถานะ (บังคับ, enabled = ใช้งาน, disabled = ไม่ใช้งาน, draft = แบบร่าง)", "รหัสนักเรียน (บังคับ, ห้ามซ้ำภายในโรงเรียน)", "วันเกิด (บังคับ, เช่น 1/5/1999)", "สัญชาติ", "เชื้อชาติ", "ศาสนา", "คำนำหน้าบิดา", "ชื่อบิดา", "นามสกุลบิดา", "คำนำหน้ามารดา", "ชื่อมารดา", "นามสกุลมารดา", "สถานภาพสมรสของบิดามารดา", "ตวามเกี่ยวข้องของนักเรียนกับผู้ปกครอง", "คำนำหน้าผู้ปกครอง", "ชื่อผู้ปกครอง", "นามสกุลผู้ปกครอง", "บ้านเลขที่", "หมู่", "อำเภอ", "ตำบล", "จังหวัด", "รหัสไปรษณีย์", "พิน (บังคับ, ตัวเลข 4 หลัก)", "ปีการศึกษาของห้อง", "ชั้นปีของห้อง (ป.1 - ป.6)", "ชื่อห้อง"}
var TeacherCsvHeader = []string{"No", "Id(ห้ามแก้)", "อีเมล (บังคับ, ห้ามซ้ำ)", "คำนำหน้า (บังคับ)", "ชื่อ (บังคับ)", "นามสกุล (บังคับ)", "เลขบัตรประชาชน (บังคับ,  ห้ามซ้ำ)", "สถานะ (บังคับ, enabled = ใช้งาน, disabled = ไม่ใช้งาน, draft = แบบร่าง)", "ความรับผิดชอบ (1 = ผู้ดูแลระบบตัดเกรด, 2 = กรอกคะแนน, 3 = ตัดเกรด, ตัวอย่าง: 1,3)", "รหัสผ่าน (บังคับ)"}
var LessonPlayLogCsvHeader = []string{"No", "ปีการศึกษา", "ชั้นปี", "ห้อง", "สังกัดวิชา", "วิชา", "บทเรียนหลัก", "ด่านที่ผ่าน", "คะแนนรวม", "ทำข้อสอบ (ครั้ง)", "เวลาเฉลี่ย/ข้อ (วินาที)", "เล่นลาสุด"}
var AnnouncerCsvHeader = []string{"No", "Id (ห้ามแก้)", "อีเมล", "คำนำหน้า", "ชื่อ", "นามสกุล", "เลขบัตรประชาชน", "สถานะ", "รหัสผ่าน"}
var ObserverCsvHeader = []string{"No", "Id (ห้ามแก้)", "อีเมล", "คำนำหน้า", "ชื่อ", "นามสกุล", "เลขบัตรประชาชน", "สถานะ", "รหัสผ่าน"}
