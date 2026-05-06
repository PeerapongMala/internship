package constant

import "time"

type TeacherRewardList struct {
	Id int `db:"id" json:"id"`
	//SubjectTeacherId int     `db:"subject_teacher_id" json:"subject_teacher_id"`
	//SubjectId        int     `db:"subject_id" json:"subject_id"`
	//SubjectName      string  `db:"subject_name" json:"subject_name"`
	//UserId           string  `db:"user_id" json:"user_id"`
	StudentId       string `db:"student_id" json:"student_id"`
	StudentTitle    string `db:"student_title" json:"student_title"`
	StudentName     string `db:"student_first_name" json:"student_first_name"`
	StudentLastName string `db:"student_last_name" json:"student_last_name"`
	AcademicYear    string `db:"academic_year" json:"academic_year"`
	Year            string `db:"year" json:"year"`
	ClassName       string `db:"class_name" json:"class_name"`
	//ItemId    int     `db:"item_id" json:"item_id"`
	ItemName string `db:"item_name" json:"item_name"`
	//ItemType  string  `db:"item_type" json:"item_type"`
	Amount int    `db:"item_amount" json:"amount"`
	Status string `db:"status" json:"status"`
	//CreatedAt string  `db:"created_at" json:"created_at"`
	//CreatedBy string  `db:"created_by" json:"created_by"`
	//UpdatedAt *string `db:"updated_at" json:"updated_at"`
	//UpdatedBy *string `db:"updated_by" json:"updated_by"`
}

type SubjectTeacher struct {
	SubjectId   int    `db:"id"`
	SubjectName string `db:"name"`
}

type ItemList struct {
	ItemId   int    `db:"id"`
	ItemName string `db:"name"`
}

type TeacherSubject struct {
	SubjectId   int    `db:"subject_id" json:"subject_id"`
	SubjectName string `db:"subject_name" json:"subject_name"`
}

type StudentResponse struct {
	UserId           string `db:"user_id" json:"user_id"`
	StudentId        string `db:"student_id" json:"student_id"`
	StudentTitle     string `db:"title" json:"title"`
	StudentFirstName string `db:"first_name" json:"first_name"`
	StudentLastName  string `db:"last_name" json:"last_name"`
}

type AcademicYear struct {
	AcademicYear int `db:"academic_year" json:"academic_year"`
}
type Year struct {
	Year string `db:"year" json:"year"`
}
type Class struct {
	ClassId           int    `db:"class_id" json:"class_id"`
	ClassName         string `db:"class_name" json:"class_name"`
	ClassYear         string `db:"class_year" json:"class_year"`
	ClassAcademicYear int    `db:"class_academic_year" json:"class_academic_year"`
	StudentCount      int    `db:"student_count" json:"student_count"`
}

type StudyGroup struct {
	Id    int    `json:"study_group_id" db:"id"`
	Name  string `json:"study_group_name" db:"name"`
	Year  string `json:"class_year" db:"year"`
	Class string `json:"class_class" db:"class"`
}

type StudentGet struct {
	UserId           string `db:"user_id" json:"user_id"`
	StudentId        string `db:"student_id" json:"student_id"`
	StudentTitle     string `db:"title" json:"title"`
	StudentFirstName string `db:"first_name" json:"first_name"`
	StudentLastName  string `db:"last_name" json:"last_name"`
	AcademicYear     int    `db:"academic_year" json:"academic_year"`
	Year             string `db:"year" json:"year"`
	Class            string `db:"class" json:"class"`
}

type ItemReponse struct {
	ItemId   int    `db:"item_id"`
	ItemName string `db:"item_name"`
}

type ItemInfo struct {
	ItemId          int     `db:"id" json:"id"`
	ItemType        string  `db:"type" json:"type"`
	ItemName        string  `db:"name" json:"name"`
	ItemDescription string  `db:"description" json:"description"`
	ImageUrl        *string `db:"image_url" json:"image_url"`
}

type CouponTransaction struct {
	Id         int        `json:"id" db:"id"`
	RewardName *string    `json:"reward_name" db:"reward_name"`
	Title      *string    `json:"title" db:"title"`
	FirstName  *string    `json:"first_name" db:"first_name"`
	LastName   *string    `json:"last_name" db:"last_name"`
	Year       *string    `json:"year" db:"year"`
	Class      *string    `json:"class_room" db:"class"`
	CreatedAt  *time.Time `json:"created_at" db:"created_at"`
	Status     string     `json:"status" db:"status"`
}
