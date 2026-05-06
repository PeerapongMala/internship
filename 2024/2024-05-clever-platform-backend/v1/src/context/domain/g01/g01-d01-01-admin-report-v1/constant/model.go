package constant

import "time"

type BestStudentListFilter struct {
	OrderBy   int        `query:"order_by" validate:"required"`
	StartDate *time.Time `query:"start_date"`
	EndDate   *time.Time `query:"end_date"`
	Columns   []int      `query:"columns"`
}

type BestTeacherListByClassStarsFilter struct {
	StartDate             *time.Time `query:"start_date"`
	EndDate               *time.Time `query:"end_date"`
	SchoolAffiliationType *string    `query:"school_affiliation_type"`
	SchoolId              *int       `query:"school_id"`
	SchoolCode            *string    `query:"school_code"`
	SchoolName            *string    `query:"school_name"`
	Columns               []int      `query:"columns"`
	SubjectName           *string    `query:"subject_name"`
	AcademicYear          *int       `query:"academic_year"`
}
