package constant

import (
	"encoding/json"
	"time"
)

type GradeTemplateListEntity struct {
	Id           *int    `json:"id" db:"id"`
	SchoolId     *int    `json:"school_id" db:"school_id"`
	Year         *string `json:"year" db:"year"`
	TemplateName *string `json:"template_name,omitempty" db:"template_name"`
	Version      *string `json:"version" db:"version"`
	ActiveFlag   *bool   `json:"active_flag" db:"active_flag"`
	Status       *string `json:"status" db:"status"`
	SubjectCount *int    `json:"subject_count" db:"subject_name_count"`
}

type GradeTemplateEntity struct {
	Id           *int       `json:"id" db:"id"`
	SchoolId     *int       `json:"school_id,omitempty" db:"school_id"`
	Year         *string    `json:"year" db:"year"`
	TemplateName string     `json:"template_name" db:"template_name"`
	ActiveFlag   *bool      `json:"active_flag,omitempty" db:"active_flag"`
	Version      *string    `json:"version,omitempty" db:"version"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
	CreatedBy    *string    `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
}

type SubjectEntity struct {
	Id                      *int     `json:"id" db:"id"`
	TemplateId              *int     `json:"template_id" db:"template_id"`
	CleverSubjectTemplateId *int     `json:"clever_subject_template_id" db:"clever_subject_template_id"`
	SubjectName             string   `json:"subject_name" db:"subject_name"`
	SubjectNo               *string  `json:"subject_no" db:"subject_no"`
	LearningArea            *string  `json:"learning_area" db:"learning_area"`
	IsClever                bool     `json:"is_clever" db:"is_clever"`
	CleverSubjectId         *int     `json:"clever_subject_id,omitempty" db:"clever_subject_id"`
	CleverSubjectName       *string  `json:"clever_subject_name,omitempty" db:"clever_subject_name"`
	Hours                   *int     `json:"hours" db:"hours"`
	Credits                 *float64 `json:"credits" db:"credits"`
	IsExtra                 *bool    `json:"is_extra" db:"is_extra"`
}

type TemplateGeneralEvaluationEntity struct {
	Id                *int             `json:"id" db:"id"`
	TemplateId        *int             `json:"template_id" db:"template_id"`
	TemplateType      string           `json:"template_type" db:"template_type"`
	TemplateName      string           `json:"template_name" db:"template_name"`
	AdditionalData    *json.RawMessage `json:"additional_data" db:"additional_data"`
	GeneralTemplateID int              `json:"general_template_id" db:"general_template_id"`
}

type TemplateIndicatorEntity struct {
	Id                               *int     `json:"id,omitempty" db:"id"`
	CleverSubjectTemplateIndicatorId *int     `json:"clever_subject_template_indicator_id" db:"clever_subject_template_indicator_id"`
	TemplateSubjectId                int      `json:"template_subject_id" db:"template_subject_id"`
	IndicatorName                    string   `json:"indicator_name" db:"name"`
	MaxValue                         *float64 `json:"max_value" db:"max_value"`
	Sort                             int      `json:"sort,omitempty" db:"sort"`
	ScoreEvaluationType              *string  `json:"score_evaluation_type,omitempty" db:"score_evaluation_type"` // ACADEMIC_CRITERIA, TEACHER_CRITERIA, NO_CRITERIA
	CleverLessonId                   *int     `json:"clever_lesson_id" db:"clever_lesson_id"`
	CleverSubLessonId                *int     `json:"clever_sub_lesson_id" db:"clever_sub_lesson_id"`

	Setting []TemplateAssessmentSettingEntity `json:"setting" db:"setting"`
}

type SubjectWithIndicatorEntity struct {
	Id                               *int     `json:"id" db:"id"`
	SubjectName                      *string  `json:"subject_name" db:"subject_name"`
	CleverSubjectTemplateIndicatorId *int     `json:"clever_subject_template_indicator_id" db:"clever_subject_template_indicator_id"`
	IndicatorId                      *int     `json:"indicator_id,omitempty" db:"indicator_id"`
	IndicatorName                    *string  `json:"indicator_name" db:"indicator_name"`
	MaxValue                         *float64 `json:"max_value" db:"max_value"`
	Sort                             *int     `json:"sort,omitempty" db:"sort"`
	ScoreEvaluationType              *string  `json:"score_evaluation_type,omitempty" db:"score_evaluation_type"` // ACADEMIC_CRITERIA, TEACHER_CRITERIA, NO_CRITERIA
	CleverLessonId                   *int     `json:"clever_lesson_id" db:"clever_lesson_id"`
	CleverSubLessonId                *int     `json:"clever_sub_lesson_id" db:"clever_sub_lesson_id"`
	CleverSubjectTemplateId          *int     `json:"clever_subject_template_id" db:"clever_subject_template_id"`
}

type TemplateAssessmentSettingEntity struct {
	Id                  *int     `json:"id" db:"id"`
	TemplateIndicatorId *int     `json:"indicator_id" db:"indicator_id"`
	EvaluationKey       *string  `json:"evaluation_key,omitempty" db:"evaluation_key"`
	EvaluationTopic     *string  `json:"evaluation_topic,omitempty" db:"evaluation_topic"`
	Value               *string  `json:"value,omitempty" db:"value"`
	Weight              *float64 `json:"weight" db:"weight"`
	LevelCount          *int     `json:"level_count" db:"level_count"`
}

type TemplateIndicatorWithAssessmentSettingEntity struct {
	Id                  *int     `json:"id" db:"id"`
	IndicatorName       *string  `json:"indicator_name" db:"indicator_name"`
	MaxValue            *float64 `json:"max_value" db:"max_value"`
	ScoreEvaluationType *string  `json:"score_evaluation_type" db:"score_evaluation_type"`
	SettingId           *int     `json:"setting_id" db:"setting_id"`
	EvaluationKey       *string  `json:"evaluation_key" db:"evaluation_key"`
	EvaluationTopic     *string  `json:"evaluation_topic" db:"evaluation_topic"`
	Value               *string  `json:"value" db:"value"`
	Weight              *float64 `json:"weight" db:"weight"`
	CleverLessonId      *int     `json:"clever_lesson_id" db:"clever_lesson_id"`
	CleverSubLessonId   *int     `json:"clever_sub_lesson_id" db:"clever_sub_lesson_id"`
	LevelCount          *int     `json:"level_count" db:"level_count"`
}

type GradeGeneralTemplateEntity struct {
	Id             *int             `json:"id" db:"id"`
	SchoolId       *int             `json:"school_id,omitempty" db:"school_id"`
	TemplateType   *string          `json:"template_type" db:"template_type"`
	TemplateName   *string          `json:"template_name" db:"template_name"`
	Status         *string          `json:"status" db:"status"`
	ActiveFlag     *bool            `json:"active_flag,omitempty" db:"active_flag"`
	CreatedAt      *time.Time       `json:"created_at" db:"created_at"`
	CreatedBy      *string          `json:"created_by" db:"created_by"`
	UpdatedAt      *time.Time       `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy      *string          `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs   *string          `json:"admin_login_as,omitempty" db:"admin_login_as"`
	AdditionalData *json.RawMessage `json:"additional_data" db:"additional_data"`
}

type YearEntity struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	ShortName string `json:"short_name" db:"short_name"`
}

type IndicatorEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}
