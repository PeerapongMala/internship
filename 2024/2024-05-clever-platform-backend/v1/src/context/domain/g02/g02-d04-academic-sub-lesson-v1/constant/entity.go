package constant

import "time"

type SubjectSubLessonRequest struct {
	Id           int       `json:"id"`
	LessonId     int       `json:"lesson_id"`
	IndicatorId  int       `json:"indicator_id"`
	Name         string    `json:"name" `
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	CreatedBy    string    `json:"created_by"`
	UpdatedAt    time.Time `json:"updated_at"`
	UpdatedBy    string    `json:"updated_by"`
	AdminLoginAs *string   `json:"admin_login_as"`
	Index        int       `json:"index"`
}

type SubjectSubLessonResponse struct {
	Id           int        `json:"id" db:"id"`
	LessonId     *int       `json:"lesson_id" db:"lesson_id"`
	IndicatorId  *int       `json:"indicator_id" db:"indicator_id"`
	Name         *string    `json:"name" db:"name"`
	Status       *string    `json:"status" db:"status"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
	CreatedBy    *string    `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
	Index        *int       `json:"index" db:"index"`
}

type SubjectSubLessonListResponse struct {
	Id             int        `json:"id" db:"id"`
	LessonId       *int       `json:"lesson_id" db:"lesson_id"`
	LessonName     *string    `json:"lesson_name" db:"lesson_name"`
	LessonIndex    *int       `json:"lesson_index" db:"lesson_index"`
	IndicatorId    *int       `json:"indicator_id" db:"indicator_id"`
	Name           *string    `json:"name" db:"name"`
	Status         *string    `json:"status" db:"status"`
	CreatedAt      *time.Time `json:"created_at" db:"created_at"`
	CreatedBy      *string    `json:"created_by" db:"created_by"`
	UpdatedAt      *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy      *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs   *string    `json:"admin_login_as" db:"admin_login_as"`
	Index          *int       `json:"index" db:"index"`
	UserId         *string    `json:"user_id" db:"user_id"`
	Email          *string    `json:"email" db:"email"`
	Title          *string    `json:"title" db:"title"`
	FirstName      *string    `json:"first_name" db:"first_name"`
	LastName       *string    `json:"last_name" db:"last_name"`
	IndicatorName  *string    `json:"indicator_name" db:"indicator_name"`
	TranscriptName *string    `json:"transcript_name" db:"transcript_name"`
	LevelCount     int        `json:"level_count" db:"level_count"`
	FileUpdatedAt  *time.Time `json:"file_updated_at" db:"file_updated_at"`
	FileIsUpdated  *bool      `json:"file_is_updated" db:"file_is_updated"`
}

type SubLessonListFilter struct {
	SearchText  *string `query:"search_text"`
	Status      *string `query:"status"`
	IndicatorId *int    `query:"indicator_id"`
	StartDate   time.Time
	EndDate     time.Time
}

type SubLessonDataEntity struct {
	Id            int        `json:"id" db:"id"`
	SubjectId     int        `json:"subject_id" db:"subject_id"`
	SubjectName   string     `json:"subject_name" db:"subject_name"`
	PlatformId    int        `json:"platform_id" db:"platform_id"`
	YearId        int        `json:"year_id" db:"year_id"`
	YearName      string     `json:"year_name" db:"year_name"`
	LevelCount    int        `json:"level_count" db:"level_count"`
	LessonId      int        `json:"lesson_id" db:"lesson_id"`
	Index         int        `json:"index" db:"index"`
	IndicatorId   int        `json:"indicator_id" db:"indicator_id"`
	IndicatorName string     `json:"indicator_name" db:"indicator_name"`
	Name          *string    `json:"name" db:"name"`
	Status        string     `json:"status" db:"status"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	CreatedBy     string     `json:"created_by" db:"created_by"`
	UpdatedAt     *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy     *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs  *string    `json:"admin_login_as" db:"admin_login_as"`
	FileUpdatedAt *time.Time `json:"file_updated_at" db:"file_updated_at"`
	FileIsUpdated *bool      `json:"file_is_updated" db:"file_is_updated"`
}

type SubLessonEntity struct {
	Id           int        `json:"id" db:"id"`
	LessonId     int        `json:"lesson_id" db:"lesson_id"`
	IndicatorId  int        `json:"indicator_id" db:"indicator_id"`
	Index        int        `json:"index" db:"index"`
	Name         *string    `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}
