package constant

type TeacherAnnounceResponse struct {
	Id           int     `json:"id" db:"id"`
	SchoolId     int     `json:"school_id" db:"school_id"`
	SchoolName   string  `json:"school_name" db:"school_name"`
	Scope        string  `json:"scope" db:"scope"`
	Type         string  `json:"type" db:"type"`
	Title        string  `json:"title" db:"title"`
	ImageUrl     *string `json:"image_url" db:"image_url"`
	Description  string  `json:"description" db:"description"`
	Status       string  `json:"status" db:"status"`
	StartAt      string  `json:"started_at" db:"started_at"`
	EndAt        string  `json:"ended_at" db:"ended_at"`
	CreatedAt    string  `json:"created_at" db:"created_at"`
	CreatedBy    string  `json:"created_by" db:"created_by"`
	UpdatedAt    *string `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string `json:"updated_by" db:"updated_by"`
	AdminLoginas *string `json:"admin_login_as" db:"admin_login_as"`
}
type SchoolListResponse struct {
	Id   int    `db:"id"`
	Name string `db:"name"`
}
