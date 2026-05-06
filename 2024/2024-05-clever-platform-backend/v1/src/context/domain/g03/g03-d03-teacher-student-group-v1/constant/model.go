package constant

import "time"

type PLayLogListDownloadByStudentGroupIdFilter struct {
	StudentGroupID int
	TeacherID      string
	StartDate      time.Time
	EndDate        time.Time
}

type StudyGroupList struct {
	ID           int        `json:"id" db:"id"`
	SubjectID    int        `json:"subject_id" db:"subject_id"`
	ClassID      int        `json:"class_id" db:"class_id"`
	ClassName    string     `json:"class_name" db:"class_name"`
	Name         string     `json:"name" db:"name"`
	Year         string     `json:"year" db:"year"`
	AcademicYear string     `json:"academic_year" db:"academic_year"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
}
