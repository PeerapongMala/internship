package constant

import (
	"time"
)

type SubjectTemplateEntity struct {
	Id                        *int                             `json:"id" db:"id"`
	Name                      *string                          `json:"name" db:"name"`
	SubjectId                 *int                             `json:"subject_id" db:"subject_id"`
	SubjectName               *string                          `json:"subject_name" db:"subject_name"`
	SeedYearId                *int                             `json:"seed_year_id" db:"seed_year_id"`
	SeedYearShortName         *string                          `json:"seed_year_short_name" db:"seed_year_short_name"`
	Status                    *string                          `json:"status" db:"status"`
	CreatedAt                 *time.Time                       `json:"created_at" db:"created_at"`
	CreatedBy                 *string                          `json:"created_by" db:"created_by"`
	UpdatedAt                 *time.Time                       `json:"updated_at" db:"updated_at"`
	UpdatedBy                 *string                          `json:"updated_by" db:"updated_by"`
	WizardIndex               *int                             `json:"wizard_index" db:"wizard_index"`
	SubjectTemplateIndicators []SubjectTemplateIndicatorEntity `json:"indicators,omitempty"`
}

type SubjectTemplateIndicatorEntity struct {
	Id                *int                          `json:"id" db:"id"`
	SubjectTemplateId *int                          `json:"subject_template_id" db:"subject_template_id"`
	LessonId          *int                          `json:"lesson_id" db:"lesson_id"`
	SubLessonId       *int                          `json:"sub_lesson_id" db:"sub_lesson_id"`
	Name              *string                       `json:"name" db:"name"`
	Type              *string                       `json:"type" db:"type"`
	Index             *int                          `json:"index" db:"index"`
	Value             *float64                      `json:"value" db:"value"`
	Levels            []IndicatorLevelSettingEntity `json:"levels"`
}

type IndicatorLevelSettingEntity struct {
	SubjectTemplateIndicatorId *int     `json:"subject_template_indicator_id" db:"subject_template_indicator_id"`
	LevelType                  *string  `json:"level_type" db:"level_type"`
	Weight                     *float64 `json:"weight" db:"weight"`
	LevelsString               string   `json:"-" db:"levels"`
	Levels                     []int    `json:"levels"`
	LevelCount                 *int     `json:"level_count" db:"level_count"`
}

type Id struct {
	Id *int `json:"id" db:"id"`
}
