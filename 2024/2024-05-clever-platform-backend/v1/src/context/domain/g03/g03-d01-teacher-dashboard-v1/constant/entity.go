package constant

import (
	"github.com/lib/pq"
	"time"
)

// ==================== Transport ==========================

type SchoolAcademicYearRangeEntity struct {
	Id        int       `json:"id" db:"id"`
	SchoolId  int       `json:"school_id" db:"school_id"`
	Name      string    `json:"name" db:"name"`
	StartDate time.Time `json:"start_date" db:"start_date"`
	EndDate   time.Time `json:"end_date" db:"end_date"`
}

type ClassEntity struct {
	Id           int        `json:"id" db:"id"`
	SchoolId     int        `json:"school_id" db:"school_id"`
	AcademicYear int        `json:"academic_year" db:"academic_year"`
	Year         string     `json:"year" db:"year"`
	Name         string     `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
}

type HomeworkEntity struct {
	Id                 int        `json:"id" db:"id"`
	Name               string     `json:"name" db:"name"`
	SubjectId          int        `json:"subject_id" db:"subject_id"`
	YearId             int        `json:"year_id" db:"year_id"`
	HomeworkTemplateId int        `json:"homework_template_id" db:"homework_template_id"`
	StartedAt          time.Time  `json:"started_at" db:"started_at"`
	DueAt              time.Time  `json:"due_at" db:"due_at"`
	ClosedAt           time.Time  `json:"closed_at" db:"closed_at"`
	Status             string     `json:"status" db:"status"`
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`
	CreatedBy          string     `json:"created_by" db:"created_by"`
	UpdatedAt          *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy          *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs       *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LevelEntity struct {
	Id            int        `json:"id" db:"id"`
	SubLessonId   int        `json:"sub_lesson_id" db:"sub_lesson_id"`
	Index         int        `json:"index" db:"index"`
	QuestionType  string     `json:"question_type" db:"question_type"`
	LevelType     string     `json:"level_type" db:"level_type"`
	Difficulty    string     `json:"difficulty" db:"difficulty"`
	LockNextLevel bool       `json:"lock_next_level" db:"lock_next_level"`
	TimerType     string     `json:"timer_type" db:"timer_type"`
	TimerTime     int        `json:"timer_time" db:"timer_time"`
	BloomType     int        `json:"bloom_type" db:"bloom_type"`
	Status        string     `json:"status" db:"status"`
	WizardIndex   int        `json:"wizard_index" db:"wizard_index"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	CreatedBy     string     `json:"created_by" db:"created_by"`
	UpdatedAt     *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy     *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs  *string    `json:"admin_login_as" db:"admin_login_as"`
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

type QuestionEntity struct {
	Id                         int     `json:"id" db:"id"`
	LevelId                    int     `json:"level_id" db:"level_id"`
	Index                      int     `json:"index" db:"index"`
	QuestionType               string  `json:"question_type" db:"question_type"`
	TimerType                  string  `json:"timer_type" db:"timer_type"`
	TimerTime                  int     `json:"timer_time" db:"timer_time"`
	ChoicePosition             string  `json:"choice_position" db:"choice_position"`
	Layout                     string  `json:"layout" db:"layout"`
	LeftBoxColumns             string  `json:"left_box_columns" db:"left_box_columns"`
	LeftBoxRows                string  `json:"left_box_rows" db:"left_box_rows"`
	BottomBoxColumns           string  `json:"bottom_box_columns" db:"bottom_box_columns"`
	BottomBoxRows              string  `json:"bottom_box_rows" db:"bottom_box_rows"`
	ImageDescriptionUrl        *string `json:"image_description_url" db:"image_description_url"`
	ImageHintUrl               *string `json:"image_hint_url" db:"image_hint_url"`
	EnforceDescriptionLanguage bool    `json:"enforce_description_language" db:"enforce_description_language"`
	EnforceChoiceLanguage      bool    `json:"enforce_choice_language" db:"enforce_choice_language"`
}

type QuestionPlayLogEntity struct {
	Id             int    `json:"id" db:"id"`
	LevelPlayLogId int    `json:"level_play_log_id" db:"level_play_log_id"`
	QuestionId     int    `json:"question_id" db:"question_id"`
	IsCorrect      bool   `json:"is_correct" db:"is_correct"`
	TimeUsed       *int   `json:"time_used" db:"time_used"`
	StudentId      string `json:"student_id" db:"student_id"`
}

type SubjectEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubjectGroupId      int        `json:"subject_group_id" db:"subject_group_id"`
	Name                string     `json:"name" db:"name"`
	Project             *string    `json:"project" db:"project"`
	SubjectLanguageType string     `json:"subject_language_type" db:"subject_language_type"`
	SubjectLanguage     *string    `json:"subject_language" db:"subject_language"`
	ImageUrl            *string    `json:"image_url" db:"image_url"`
	Status              string     `json:"status" db:"status"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LessonEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubjectId           int        `json:"subject_id" db:"subject_id"`
	SubjectName         *string    `json:"subject_name" db:"subject_name"`
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

type StudentScoreEntity struct {
	StudentId string `json:"id" db:"id"`
	FullName  string `json:"full_name" db:"full_name"`
	Sum       int    `json:"sum" db:"sum"`
}

type SchoolAcademicYearEntity struct {
	Id        int       `json:"id" db:"id"`
	SchoolId  int       `json:"school_id" db:"school_id"`
	Name      string    `json:"name" db:"name"`
	StartDate time.Time `json:"start_date" db:"start_date"`
	EndDate   time.Time `json:"end_date" db:"end_date"`
}

type SubLessonEntity struct {
	Id           int        `json:"id" db:"id"`
	LessonId     int        `json:"lesson_id" db:"lesson_id"`
	Index        int        `json:"index" db:"index"`
	IndicatorId  int        `json:"indicator_id" db:"indicator_id"`
	Name         string     `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type ClassStudentEntity struct {
	ClassId   int    `json:"class_id" db:"class_id"`
	StudentId string `json:"student_id" db:"student_id"`
}

type ProgressReport struct {
	Scope    string  `db:"scope"`
	Progress float64 `db:"progress"`
}

type HomeworkLevels struct {
	HomeworkId int           `db:"homework_id"`
	Levels     pq.Int64Array `db:"level_ids"`
}

type Subject struct {
	Id       *int    `json:"id" db:"id"`
	YearName *string `json:"year_name" db:"year_name"`
	Name     *string `json:"name" db:"name"`
}
