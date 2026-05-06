package constant

import "time"

type GradePorphor6DataEntity struct {
	ID               int       `json:"id" db:"id"`
	LearningAreaName *string   `json:"learning_area_name,omitempty" db:"learning_area_name"`
	StudentID        *string   `json:"student_id,omitempty" db:"student_id"`
	DataJSON         *string   `json:"data_json,omitempty" db:"data_json"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

type GradeEvaluationFormEntity struct {
	Id           *int       `json:"id" db:"id"`
	SchoolId     *int       `json:"school_id,omitempty" db:"school_id"`
	TemplateId   *int       `json:"template_id,omitempty" db:"template_id"`
	AcademicYear *string    `json:"academic_year" db:"academic_year"`
	Year         *string    `json:"year" db:"year"`
	SchoolRoom   *string    `json:"school_room" db:"school_room"`
	SchoolTerm   *string    `json:"school_term" db:"school_term"`
	IsLock       *bool      `json:"is_lock,omitempty" db:"is_lock"`
	Status       *string    `json:"status" db:"status"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
	CreatedBy    *string    `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
}

type GradePorphor6ListRequest struct {
	SearchText string `query:"search_text"`
}
