package constant

import (
	"time"
)

type SubjectLessonCreateRequest struct {
	SubjectId           int     `validate:"required" json:"subject_id"`
	Index               int     `json:"index"`
	Name                string  `json:"name"`
	FontName            string  `json:"font_name"`
	FontSize            string  `json:"font_size"`
	BackgroundImagePath string  `json:"background_image_path"`
	Status              string  `validate:"required" json:"status"`
	AdminLoginAs        *string `validate:"omitempty,uuid4" json:"admin_login_as"`
	WizardIndex         int     `json:"wizard_index"`
	UpdatedAt           time.Time
	CreatedAt           time.Time
	CreatedBy           string
	UpdatedBy           string
}

type SubjectLessonPatchRequest struct {
	Id                  int     `validate:"required" params:"lessonId"`
	Index               int     `json:"index"`
	Name                string  `json:"name"`
	FontName            string  `json:"font_name"`
	FontSize            string  `json:"font_size"`
	BackgroundImagePath string  `json:"background_image_path"`
	Status              string  `json:"status"`
	AdminLoginAs        *string `validate:"omitempty,uuid4" json:"admin_login_as"`
	WizardIndex         int     `json:"wizard_index"`
	UpdatedAt           time.Time
	UpdatedBy           string
}

type SubjectLessonResponse struct {
	Id                  int        `json:"id,omitempty" db:"id"`
	SubjectId           *int       `json:"subject_id,omitempty" db:"subject_id"`
	Index               *int       `json:"index,omitempty" db:"index"`
	Name                *string    `json:"name,omitempty" db:"name"`
	FontName            *string    `json:"font_name,omitempty" db:"font_name"`
	FontSize            *string    `json:"font_size,omitempty" db:"font_size"`
	BackgroundImagePath *string    `json:"background_image_path,omitempty" db:"background_image_path"`
	Status              *string    `json:"status,omitempty" db:"status"`
	CreatedAt           *time.Time `json:"created_at,omitempty" db:"created_at"`
	CreatedBy           *string    `json:"created_by,omitempty" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
	WizardIndex         *int       `json:"wizard_index,omitempty" db:"wizard_index"`
	UserId              *string    `json:"user_id,omitempty" db:"user_id"`
	Email               *string    `json:"email,omitempty" db:"email"`
	Title               *string    `json:"title,omitempty" db:"title"`
	FirstName           *string    `json:"first_name,omitempty" db:"first_name"`
	LastName            *string    `json:"last_name,omitempty" db:"last_name"`
	RewardedStageCount  *int       `json:"rewarded_stage_count" db:"rewarded_stage_count"`
	// LessonMonsterImage  LessonMonsterImage `json:"lesson_monster_image" db:"lesson_monster_image"`
}

type LessonMonsterImage struct {
	Id         int    `json:"id" db:"id"`
	ImangePath string `json:"image_path" db:"image_path"`
	LessonId   int    `json:"lesson_id" db:"lesson_id"`
	LevelType  string `json:"level_type" db:"level_type"`
}

type LessonListFilter struct {
	SearchText *string `query:"search_text"`
	Status     *string `query:"status"`
	StartDate  time.Time
	EndDate    time.Time
}

type LessonDataEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubjectId           int        `json:"subject_id" db:"subject_id"`
	SubjectName         string     `json:"subject_name" db:"subject_name"`
	YearId              int        `json:"year_id" db:"year_id"`
	YearName            string     `json:"year_name" db:"year_name"`
	SubLessonCount      int        `json:"sub_lesson_count" db:"sub_lesson_count"`
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

type LessonEntity struct {
	SubjectId           int        `json:"subject_id" db:"subject_id"`
	Id                  int        `json:"id" db:"id"`
	Name                string     `json:"name" db:"name"`
	FontName            string     `json:"font_name" db:"font_name"`
	FontSize            string     `json:"font_size" db:"font_size"`
	BackgroundImagePath string     `json:"background_image_path" db:"background_image_path"`
	Index               int        `json:"index" db:"index"`
	Status              string     `json:"status" db:"status"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
	WizardIndex         int        `json:"wizard_index" db:"wizard_index"`
}

type LessonMonsterImageEntity struct {
	ID        int    `json:"id" db:"id"`
	ImagePath string `json:"image_path" db:"image_path"`
	LessonID  int    `json:"lesson_id" db:"lesson_id"`
	LevelType string `json:"level_type" db:"level_type"`
}

type LessonMetaEntity struct {
	SubjectId        int    `json:"subject_id" db:"subject_id"`
	SubjectName      string `json:"subject_name" db:"subject_name"`
	SubjectGroupId   int    `json:"subject_group_id" db:"subject_group_id"`
	SubjectGroupName string `json:"subject_group_name" db:"subject_group_name"`
	YearId           int    `json:"year_id" db:"year_id"`
	YearName         string `json:"year_name" db:"year_name"`

	*SubjectMetaEntity
}
type SubjectMetaEntity struct {
	LessonCount    int                       `json:"lesson_count" db:"lesson_count"`
	SubLessonCount int                       `json:"sub_lesson_count" db:"sub_lesson_count"`
	Lessons        []SubjectMetaLessonEntity `json:"lessons" db:"lessons"`
}

type SubjectMetaLessonEntity struct {
	LessonId       int `json:"lesson_id" db:"lesson_id"`
	SubLessonCount int `json:"sub_lesson_count" db:"sub_lesson_count"`
}
