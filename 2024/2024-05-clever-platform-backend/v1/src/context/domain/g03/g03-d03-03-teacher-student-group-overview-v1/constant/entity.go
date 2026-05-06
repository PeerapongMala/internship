package constant

import "time"

type StudyGroupEntity struct {
	Id           int        `json:"id" db:"id"`
	SubjectId    int        `json:"subject_id" db:"subject_id"`
	ClassId      int        `json:"class_id" db:"class_id"`
	Name         string     `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LessonEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubjectId           int        `json:"subject_id" db:"subject_id"`
	Index               int        `json:"index" db:"index"`
	Name                string     `json:"name" db:"name"`
	FontName            string     `json:"font_name" db:"font_name"`
	FontSize            string     `json:"font_size" db:"font_size"`
	BackgroundImagePath string     `json:"background_image_path" db:"background_image_path"`
	Status              string     `json:"status" db:"status"`
	WizardIndex         int        `json:"wizard_index" db:"wizard_index"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
}

type SubLessonEntity struct {
	Id           int        `json:"id" db:"id"`
	LessonId     int        `json:"lesson_id" db:"lesson_id"`
	Index        int        `json:"index" db:"index"`
	IndicatorId  int        `json:"indicator_id" db:"indicator_id"`
	Name         *string    `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LevelPlayLogEntity struct {
	Id           int       `json:"id" db:"id"`
	ClassId      *int      `json:"class_id" db:"class_id"`
	StudentId    string    `json:"student_id" db:"student_id"`
	LevelId      int       `json:"level_id" db:"level_id"`
	HomeworkId   *int      `json:"homework_id" db:"homework_id"`
	PlayedAt     time.Time `json:"played_at" db:"played_at"`
	Star         int       `json:"star" db:"star"`
	TimeUsed     int       `json:"time_used" db:"time_used"`
	AdminLoginAs *string   `json:"admin_login_as" db:"admin_login_as"`
}

type StudentLevelPlayLogCountEntity struct {
	StudentId         string `db:"student_id"`
	LevelPlayLogCount string `db:"level_play_log_count"`
}

type StudentScoreEntity struct {
	StudentId string `json:"id" db:"id"`
	FullName  string `json:"full_name" db:"full_name"`
	Sum       int    `json:"sum" db:"sum"`
}

type ClassStudentEntity struct {
	ClassId   int    `json:"class_id" db:"class_id"`
	StudentId string `json:"student_id" db:"student_id"`
}

type UserEntity struct {
	Id        string     `json:"id" db:"id"`
	Email     *string    `json:"email" db:"email"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	IdNumber  *string    `json:"id_number" db:"id_number"`
	ImageUrl  *string    `json:"image_url" db:"image_url"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy *string    `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
}

type ProgressReport struct {
	Scope    string  `db:"scope"`
	Progress float64 `db:"progress"`
}
