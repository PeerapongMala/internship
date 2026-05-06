package constant

import "time"

type ValidateRequest struct {
	RoomType string `json:"room_type"`
	Role     []int  `json:"role"`
	SchoolID int    `json:"school_id"`
	UserID   string `json:"user_id"`
	OtherID  any    `json:"other_id"`
}

type ChatFilter struct {
	SchoolID     int       `json:"school_id" params:"school_id"`
	UserID       string    `json:"user_id"`
	RoomID       string    `json:"room_id"`
	RoomType     string    `json:"room_type" query:"room_type"`
	CreatedAt    time.Time `json:"created_at"`
	Search       string    `json:"-" query:"search"`
	SubjectID    int       `json:"subject_id" query:"subject_id"`
	AcademicYear int       `json:"academic_year" query:"academic_year"`
}
