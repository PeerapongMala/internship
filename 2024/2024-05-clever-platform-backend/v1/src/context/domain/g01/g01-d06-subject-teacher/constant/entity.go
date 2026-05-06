package constant

import "time"

type SubjectEntity struct {
	Id              int        `json:"id" db:"id"`
	Name            string     `json:"name" db:"name"`
	Year            string     `json:"year" db:"year"`
	ContractName    string     `json:"contract_name,omitempty" db:"contract_name"`
	ContractStatus  string     `json:"contract_status,omitempty" db:"contract_status"`
	CurriculumGroup string     `json:"curriculum_group,omitempty" db:"curriculum_group"`
	UpdatedAt       *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy       *string    `json:"updated_by,omitempty" db:"updated_by"`
	IsExpired       *bool      `json:"is_expired,omitempty" db:"is_expired"`
}

type TeacherEntity struct {
	Id           string     `json:"id" db:"id"`
	AcademicYear int        `json:"academic_year,omitempty" db:"academic_year"`
	Title        string     `json:"title" db:"title"`
	FirstName    string     `json:"first_name" db:"first_name"`
	LastName     string     `json:"last_name" db:"last_name"`
	Email        string     `json:"email" db:"email"`
	LastLogin    *time.Time `json:"last_login" db:"last_login"`
}

type TeacherItemGroupEntity struct {
	Id        *int    `json:"id" db:"id"`
	SubjectId *int    `json:"subject_id" db:"subject_id"`
	TeacherId *string `json:"teacher_id" db:"teacher_id"`
}
