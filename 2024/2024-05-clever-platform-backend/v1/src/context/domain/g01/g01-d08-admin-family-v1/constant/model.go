package constant

import "time"

type Member struct {
	FamilyID  int    `json:"family_id" db:"family_id"`
	UserID    string `json:"user_id" db:"user_id"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
	IsOwner   string `json:"is_owner" db:"is_owner"`
}

type Family struct {
	FamilyID  int       `json:"id" db:"id" params:"id"`
	Status    string    `json:"status" db:"status" params:"status"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy string    `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy string    `json:"updated_by" db:"updated_by"`
}

type UserFilter struct {
	UserIDs    []string
	Role       string `params:"role"`
	FamilyID   int    `params:"family_id"`
	UserID     string `query:"user_id"`
	FirstName  string `query:"first_name"`
	LastName   string `query:"last_name"`
	LineID     string `query:"line_id"`
	SchoolName string `query:"school_name"`
}

type FamilyFilter struct {
	FamilyID    int       `json:"id" db:"id" query:"family_id"`
	Status      string    `json:"status" db:"status" query:"status"`
	StartDate   string    `json:"start_date" query:"start_date"`
	EndDate     string    `json:"end_date" query:"end_date"`
	MemberCount int       `json:"-" query:"member_count"`
	UserID      string    `json:"user_id" query:"user_id"`
	FirstName   string    `json:"first_name" query:"first_name"`
	LastName    string    `json:"last_name" query:"last_name"`
	LineID      string    `json:"line_id" query:"line_id"`
	Member      int       `json:"member_count" query:"member_count"`
	CreatedAt   time.Time `json:"created_at" query:"created_at"`
}

type StudentFilter struct {
	Search       string `json:"search" query:"search"`
	SchoolID     int    `json:"school_id" query:"school_id"`
	AcademicYear int    `json:"academic_year" query:"academic_year"`
	Year         string `json:"year" query:"year"`
	ClassName    string `json:"class_name" query:"class_name"`
}

type DropdownFilter struct {
	SchoolID     int    `query:"school_id"`
	AcademicYear int    `query:"academic_year"`
	Year         string `query:"year"`
}

type SchoolList struct {
	SchoolID   int    `json:"school_id" db:"school_id"`
	SchoolName string `json:"school_name" db:"school_name"`
}

type ClassList struct {
	ClassID   int    `json:"class_id" db:"class_id"`
	ClassName string `json:"class_name" db:"class_name"`
}
