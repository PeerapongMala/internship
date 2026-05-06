package constant

import (
	"mime/multipart"
	"time"
)

type Announcement struct {
	ID          int     `json:"announcement_id" db:"id"`
	Title       string  `json:"title" db:"title"`
	Description *string `json:"description" db:"description"`
	Type        string  `json:"type" db:"type"`
}

type AnnouncementList struct {
	SchoolID       int       `json:"school_id" db:"school_id"`
	AnnouncementID int       `json:"announcement_id" db:"announcement_id"`
	Scope          string    `json:"scope" db:"scope"`
	Type           string    `json:"type" db:"type"`
	Title          string    `json:"title" db:"title"`
	StartDate      time.Time `json:"started_at" db:"started_at"`
	EndDate        time.Time `json:"ended_at" db:"ended_at"`
}

type Homework struct {
	HomeworkID   int       `json:"homework_id" db:"homework_id"`
	HomeworkName string    `json:"homework_name" db:"homework_name"`
	SubjectName  string    `json:"subject_name" db:"subject_name"`
	Lesson       string    `json:"lesson" db:"lesson"`
	SubLesson    string    `json:"sub_lesson" db:"sub_lesson"`
	AssignTo     string    `json:"assign_to" db:"assign_to"`
	StartedAt    time.Time `json:"started_at" db:"started_at"`
	DueAt        time.Time `json:"due_at" db:"due_at"`
	LevelCount   int       `json:"level_count" db:"level_count"`
	Status       string    `json:"status"`
}

type StudentInFamily struct {
	UserID    string  `json:"user_id" db:"user_id"`
	StudentID string  `json:"student_id" db:"student_id"`
	Title     string  `json:"title" db:"title"`
	FirstName string  `json:"first_name" db:"first_name"`
	LastName  string  `json:"last_name" db:"last_name"`
	ImageUrl  *string `json:"image_url" db:"image_url"`
	SchoolId  *int    `json:"school_id" db:"school_id"`
}

type Student struct {
	StudentID  string `json:"student_id" db:"student_id"`
	Title      string `json:"title" db:"title"`
	FirstName  string `json:"first_name" db:"first_name"`
	LastName   string `json:"last_name" db:"last_name"`
	ClassID    int    `json:"class_id" db:"class_id"`
	SchoolID   int    `json:"school_id" db:"school_id"`
	SchoolCode string `json:"school_code" db:"school_code"`
}

type HomeworkPlayCount struct {
	UserID         *string    `db:"user_id"`
	LevelPlayCount *int       `db:"level_play_count"`
	MaxPlayedAt    *time.Time `db:"max_played_at"`
}

type Member struct {
	UserID    string  `json:"user_id" db:"user_id"`
	Title     string  `json:"title" db:"title"`
	FirstName string  `json:"first_name" db:"user_id"`
	LastName  string  `json:"last_name" db:"user_id"`
	Role      string  `json:"role"`
	IsOwner   bool    `json:"is_owner" db:"is_owner"`
	ImageUrl  *string `json:"img_url" db:"image_url"`
}

type FamilyMembers struct {
	FamilyID int       `json:"family_id" db:"family_id"`
	Member   []*Member `json:"member"`
}

type OverViewStatus struct {
	StatusName string `json:"status_name"`
	Count      int    `json:"count"`
	Total      int    `json:"total"`
}

type Bug struct {
	BugID            int                     `json:"bug_id" db:"bug_id" form:"bug_id"`
	Os               *string                 `json:"os" validate:"required" form:"os"`
	Browser          *string                 `json:"browser" validate:"required" form:"browser"`
	Type             string                  `json:"type" db:"type" validate:"required" form:"type"`
	Platform         string                  `json:"platform" db:"platform" validate:"required" form:"platform"`
	Version          string                  `json:"version" db:"version" validate:"required" form:"version"`
	Priority         string                  `json:"priority" db:"priority" validate:"required" form:"priority"`
	Url              *string                 `json:"url" validate:"required" form:"url"`
	Description      string                  `json:"description" db:"description" validate:"required" form:"description"`
	Status           string                  `json:"status" db:"status" validate:"required" form:"status"`
	CreatedAt        time.Time               `json:"created_at" db:"created_at" validate:"required" form:"created_at"`
	CreatedBy        string                  `json:"created_by" db:"created_by" form:"created_by"`
	CreaterFisrtName string                  `json:"creater_first_name" db:"creater_first_name" form:"creater_first_name"`
	CreaterLastName  string                  `json:"creater_last_name" db:"creater_last_name" form:"creater_last_name"`
	Role             string                  `json:"role" db:"role" form:"role"`
	Images           []*multipart.FileHeader `json:"-"`
	ImageUrls        []*string               `json:"image_urls"`
	EditedAt         *time.Time              `json:"edited_at" db:"edited_at" form:"edited_at"`
	EditedBy         *string                 `json:"edited_by" db:"edited_by" form:"edited_by"`
	EditerFirstName  *string                 `json:"editer_first_name" db:"editer_first_name" form:"editer_first_name"`
	EditerLastName   *string                 `json:"editer_last_name" db:"editer_last_name" form:"editer_last_name"`
}

type BugList struct {
	BugID       int    `json:"bug_id" db:"bug_id"`
	Description string `json:"description" db:"description"`
}

type User struct {
	UserID string `json:"user_id"`
	Task   string `json:"task"`
}
type Family struct {
	Users        []User    `json:"users"`
	ManageFamily string    `json:"manage_family"`
	FamilyID     int       `json:"family_id"`
	CreatedBy    string    `json:"created_by"`
	CreatedAt    time.Time `json:"created_at"`
	Status       string    `json:"status"`
}

type OverViewStatusFilter struct {
	StudentID    string `json:"student_id" params:"user_id"`
	AcademicYear int    `json:"academic_year" params:"academic_year"`
	SubjectID    int    `json:"subject_id" params:"subject_id"`
	StartedAt    string `json:"started_at" query:"started_at"`
	EndedAt      string `json:"ended_at" query:"ended_at"`
	ClassID      int    `json:"class_id" params:"class_id"`
	LessonID     int    `json:"lesson_id" params:"lesson_id"`
}

type PlayLogData struct {
	LevelID  int       `json:"level_id" db:"level_id"`
	PlayedAt time.Time `json:"played_at" db:"played_at"`
	Star     int       `json:"star" db:"star"`
	TimeUsed int       `json:"time_used" db:"time_used"`
}

type LessonScore struct {
	LessonID   int    `json:"lesson_id" db:"lesson_id"`
	LessonName string `json:"lesson_name" db:"lesson_name"`
	Score      int    `json:"progress" db:"score"`
}

type SubLessonScore struct {
	SubLessonID   int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName string `json:"sub_lesson_name" db:"sub_lesson_name"`
	Score         int    `json:"progress" db:"score"`
}

type Subject struct {
	SubjectName string `json:"subject_name" db:"subject_name"`
	SubjectID   int    `json:"subject_id" db:"subject_id"`
}

type Lesson struct {
	LessonID   int    `json:"lesson_id" db:"lesson_id"`
	LessonName string `json:"lesson_name" db:"lesson_name"`
}

type SchoolDetails struct {
	SchoolId       *string `json:"school_id" db:"id"`
	SchoolCode     *string `json:"school_code" db:"code"`
	SchoolName     *string `json:"school_name" db:"name"`
	SchoolImageUrl *string `json:"school_image_url" db:"image_url"`
}
