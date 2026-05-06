package constant

type PutStudyGroupBodyRequest struct {
	StudentGroupID *int   `json:"student_group_id" validate:"omitempty"`
	SubjectID      int    `json:"subject_id" validate:"required"`
	ClassID        int    `json:"class_id" validate:"required"`
	Status         Status `json:"status" validate:"required"`
	Name           string `json:"study_group_name" validate:"required"`
}

type UpdateStudyGroup struct {
	ID        int
	Name      string
	ClassID   int
	SubjectID int
	UserID    string
	Status    Status
}

type InsertStudyGroup struct {
	Name      string
	ClassID   int
	SubjectID int
	UserID    string
	Status    Status
}

type GetStudyGroupByIDResponse struct {
	StudyGroup
	StudentCount int    `json:"student_count" db:"student_count"`
	SubjectName  string `json:"subject_name" db:"subject_name"`
	AcademicYear int    `json:"class_academic_year" db:"class_academic_year"`
	Year         string `json:"class_year" db:"class_year"`
	ClassName    string `json:"class_name" db:"class_name"`
}
