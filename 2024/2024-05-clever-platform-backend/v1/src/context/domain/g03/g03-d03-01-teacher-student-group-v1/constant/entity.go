package constant

type Status string

const (
	Enable  Status = "enable"
	Disable Status = "disable"
)

type StudyGroup struct {
	ID           int     `json:"id" db:"id"`
	SubjectID    int     `json:"subject_id" db:"subject_id"`
	ClassID      int     `json:"class_id" db:"class_id"`
	Name         string  `json:"name" db:"name"`
	Status       string  `json:"status" db:"status"`
	CreatedAt    string  `json:"created_at" db:"created_at"`
	CreatedBy    string  `json:"created_by" db:"created_by"`
	UpdatedAt    *string `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string `json:"admin_login_as" db:"admin_login_as"`
}
