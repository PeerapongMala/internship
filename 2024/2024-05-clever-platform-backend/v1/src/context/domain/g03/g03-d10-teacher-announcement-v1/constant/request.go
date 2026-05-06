package constant

import (
	"mime/multipart"
	"time"
)

type TeacherAnnounceCreate struct {
	SchoolId     int                   `db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	CreatedBy    string                `db:"created_by"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type TeacherAnnounceUpdate struct {
	Id           int                   `db:"id"`
	SchoolId     int                   `db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	UpdatedBy    string                `db:"created_by"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type CheckRoleRequest struct {
	Roles     []int
	SubjectId string
}

type TeacherAnnounceFilter struct {
	StartDate      string `query:"started_at"`
	EndDate        string `query:"ended_at"`
	SchoolId       int    `query:"school_id"`
	Status         string `query:"status"`
	AnnouncementId int    `query:"announcement_id"`
	Title          string `query:"title"`
	SchoolName     string `query:"school_name"`
}
type AnnouncementBulkEdit struct {
	Id           int     `db:"id" json:"id"`
	Status       string  `db:"status" json:"status"`
	UpdatedBy    string  `db:"updated_by" json:"-"`
	AdminLoginAs *string `db:"admin_login_as" json:"-"`
}
