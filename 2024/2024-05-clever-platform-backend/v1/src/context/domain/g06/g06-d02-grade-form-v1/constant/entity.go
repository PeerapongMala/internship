package constant

import (
	"encoding/json"
	"time"

	"github.com/lib/pq"
)

type GradeEvaluationFormEntity struct {
	Id           *int                  `json:"id" db:"id"`
	SchoolId     *int                  `json:"school_id,omitempty" db:"school_id"`
	TemplateId   *int                  `json:"template_id,omitempty" db:"template_id"`
	AcademicYear *string               `json:"academic_year" db:"academic_year"`
	Year         *string               `json:"year" db:"year"`
	SchoolRoom   *string               `json:"school_room" db:"school_room"`
	StudentCount *int                  `json:"student_count" db:"student_count"`
	SchoolTerm   *string               `json:"school_term" db:"school_term"`
	IsLock       *bool                 `json:"is_lock,omitempty" db:"is_lock"`
	Status       *EvaluationFormStatus `json:"status" db:"status"`
	CreatedAt    *time.Time            `json:"created_at" db:"created_at"`
	CreatedBy    *string               `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time            `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy    *string               `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs *string               `json:"admin_login_as,omitempty" db:"admin_login_as"`
	IsArchived   *bool                 `json:"is_archived" db:"is_archived"`
	WizardIndex  *int                  `json:"wizard_index" db:"wizard_index"`
}

type GradeFormListEntity struct {
	Id                    *int                  `json:"id" db:"id"`
	TempalteId            *int                  `json:"template_id" db:"template_id"`
	TemplateName          *string               `json:"template_name" db:"template_name"`
	AcademicYear          *string               `json:"academic_year" db:"academic_year"`
	Year                  *string               `json:"year" db:"year"`
	SchoolRoom            *string               `json:"school_room" db:"school_room"`
	SchoolTerm            *string               `json:"school_term" db:"school_term"`
	IsLock                *bool                 `json:"is_lock" db:"is_lock"`
	Status                *EvaluationFormStatus `json:"status" db:"status"`
	IsArchived            *bool                 `json:"is_archived" db:"is_archived"`
	OngoingSheetCount     *int                  `json:"ongoing_sheet_count" db:"ongoing_sheet_count"`
	TotalSignedSheetCount *int                  `json:"total_signed_sheet_count" db:"total_signed_sheet_count"`
	WizardIndex           *int                  `json:"wizard_index" db:"wizard_index"`
}

func (e *GradeFormListEntity) GetStatus() *string {
	if e.Status == nil {
		return nil
	}

	return (*string)(e.Status)
}

type GradeEvaluationFormGeneralEvaluationEntity struct {
	Id                          *int             `json:"id" db:"id"`
	FormId                      *int             `json:"form_id" db:"form_id"`
	TemplateType                *string          `json:"template_type" db:"template_type"`
	TemplateName                *string          `json:"template_name" db:"template_name"`
	AdditionalData              *json.RawMessage `json:"additional_data" db:"additional_data"`
	TemplateGeneralEvaluationID *int             `json:"template_general_evaluation_id" db:"template_general_evaluation_id"`
}

type GradeEvaluationFormSubjectEntity struct {
	Id                      *int     `json:"id" db:"id"`
	FormId                  *int     `json:"form_id" db:"form_id"`
	SubjectTemplateId       *int     `json:"subject_template_id" db:"subject_template_id"`
	CleverSubjectTemplateId *int     `json:"clever_subject_template_id" db:"clever_subject_template_id"`
	SubjectNo               *string  `json:"subject_no" db:"subject_no"`
	LearningArea            *string  `json:"learning_area" db:"learning_area"`
	Credits                 *float64 `json:"credits" db:"credits"`
	IsExtra                 *bool    `json:"is_extra" db:"is_extra"`
	SubjectName             *string  `json:"subject_name" db:"subject_name"`
	IsClever                *bool    `json:"is_clever" db:"is_clever"`
	CleverSubjectId         *int     `json:"clever_subject_id" db:"clever_subject_id"`
	Hours                   *int     `json:"hours" db:"hours"`
}

type GradeEvaluationFormIndicatorEntity struct {
	Id                               *int     `json:"id" db:"id"`
	CleverSubjectTemplateIndicatorId *int     `json:"clever_subject_template_indicator_id" db:"clever_subject_template_indicator_id"`
	EvaluationFormSubjectId          *int     `json:"evaluation_form_subject_id" db:"evaluation_form_subject_id"`
	Name                             *string  `json:"name" db:"name"`
	MaxValue                         *float64 `json:"max_value" db:"max_value"`
	Sort                             *int     `json:"sort" db:"sort"`
	ScoreEvaluationType              *string  `json:"score_evaluation_type" db:"score_evaluation_type"`
	CleverLessonId                   *int     `json:"clever_lesson_id" db:"clever_lesson_id"`
	CleverSubLessonId                *int     `json:"clever_sub_lesson_id" db:"clever_sub_lesson_id"`

	Setting []*GradeEvaluationFormSettingEntity `json:"setting,omitempty" db:"-"`
}

type GradeEvaluationFormSettingEntity struct {
	Id                        *int     `json:"id" db:"id"`
	EvaluationFormIndicatorId *int     `json:"evaluation_form_indicator_id" db:"evaluation_form_indicator_id"`
	EvaluationKey             *string  `json:"evaluation_key" db:"evaluation_key"`
	EvaluationTopic           *string  `json:"evaluation_topic" db:"evaluation_topic"`
	Value                     *string  `json:"value" db:"value"`
	Weight                    *float64 `json:"weight" db:"weight"`
	LevelCount                *int     `json:"level_count" db:"level_count"`
}

type GradeEvaluationFormAdditionalPersonEntity struct {
	Id        *int    `json:"id" db:"id"`
	FormId    *int    `json:"form_id" db:"form_id"`
	ValueType *string `json:"value_type" db:"value_type"`
	ValueId   *int    `json:"value_id" db:"value_id"`
	UserType  *string `json:"user_type" db:"user_type"`
	UserId    *string `json:"user_id" db:"user_id"`
}

type GradeEvaluationFormSubjectWithNameEntity struct {
	GradeEvaluationSubjectId         *int     `json:"id" db:"id"`
	FormId                           *int     `json:"form_id" db:"form_id"`
	GradeEvaluationSubjectTemplateId *int     `json:"template_subject_id" db:"template_subject_id"`
	SubjectName                      *string  `json:"subject_name" db:"subject_name"`
	IsClever                         *bool    `json:"is_clever" db:"is_clever"`
	CleverSubjectId                  *int     `json:"clever_subject_id" db:"clever_subject_id"`
	CleverSubjectName                *string  `json:"clever_subject_name,omitempty" db:"clever_subject_name"`
	CleverSubjectTemplateId          *int     `json:"clever_subject_template_id" db:"clever_subject_template_id"`
	Hours                            *int     `json:"hours" db:"hours"`
	SubjectNo                        *string  `json:"subject_no" db:"subject_no"`
	LearningArea                     *string  `json:"learning_area" db:"learning_area"`
	Credits                          *float64 `json:"credits" db:"credits"`
	IsExtra                          *bool    `json:"is_extra" db:"is_extra"`

	Indicator []*GradeEvaluationFormIndicatorEntity `json:"indicator" db:"-"`
}

type AdditionalPersonWithPersonDataEntity struct {
	Id           *int          `json:"-" db:"id"`
	ValueType    *string       `json:"-" db:"value_type"`
	ValueId      *int          `json:"-" db:"value_id"`
	UserType     *string       `json:"user_type" db:"user_type"`
	UserId       *string       `json:"user_id" db:"user_id"`
	Email        *string       `json:"email" db:"email"`
	Title        *string       `json:"title" db:"title"`
	FirstName    *string       `json:"first_name" db:"first_name"`
	LastName     *string       `json:"last_name" db:"last_name"`
	TeacherRoles pq.Int64Array `json:"teacher_roles" db:"teacher_roles"`
}

type EvaluationSheetEntity struct {
	ID                                *int                   `json:"id" db:"id"`
	FormID                            *int                   `json:"form_id" db:"form_id"`
	ValueType                         *SheetValueType        `json:"value_type,omitempty" db:"value_type"`
	EvaluationFormSubjectID           *int                   `json:"evaluation_form_subject_id,omitempty" db:"evaluation_form_subject_id"`
	EvaluationFormGeneralEvaluationID *int                   `json:"evaluation_form_general_evaluation_id,omitempty" db:"evaluation_form_general_evaluation_id"`
	IsLock                            *bool                  `json:"is_lock,omitempty" db:"is_lock"`
	Status                            *EvaluationSheetStatus `json:"status" db:"status"`
	CreatedAt                         *time.Time             `json:"created_at" db:"created_at"`
	CreatedBy                         *string                `json:"created_by" db:"created_by"`
	UpdatedAt                         *time.Time             `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy                         *string                `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs                      *string                `json:"admin_login_as,omitempty" db:"admin_login_as"`
	CurrentDataEntryID                *int                   `json:"current_data_entry_id,omitempty" db:"current_data_entry_id"`
}

func (e *EvaluationSheetEntity) GetStatus() *string {
	if e.Status == nil {
		return nil
	}

	return (*string)(e.Status)
}

type GradeTemplateListEntity struct {
	Id           *int    `json:"id" db:"id"`
	Year         *string `json:"year" db:"year"`
	TemplateName *string `json:"template_name,omitempty" db:"template_name"`
	Version      *string `json:"version" db:"version"`
	ActiveFlag   *bool   `json:"active_flag" db:"active_flag"`
	Status       *string `json:"status" db:"status"`
	SubjectCount *int    `json:"subject_count" db:"subject_name_count"`
}

type GradeEvaluationFormListFilter struct {
	SchoolId int `query:"school_id" validate:"required"`

	TemplateID   *int   `query:"template_id"`
	TemplateName string `query:"template_name"`
	AcademicYear string `query:"academic_year"`
	Year         string `query:"year"`
	SchoolRoom   string `query:"school_room"`
	SchoolTerm   string `query:"school_term"`
	Status       string `query:"status"`
	IsArchived   *bool  `query:"is_archived"`
	Search       string `query:"search"`
}

type EvaluationSheetListFilter struct {
	SubjectId           *int `query:"subject_id"`
	GeneralEvaluationId *int `query:"general_evaluation_id"`

	SchoolId                int                   `query:"school_id" validate:"required"`
	FormID                  int                   `query:"form_id"`
	Year                    string                `query:"year"`
	AcademicYear            string                `query:"academic_year"`
	SchoolRoom              string                `query:"school_room"`
	SchoolTerm              string                `query:"school_term"`
	Status                  EvaluationSheetStatus `query:"status"`
	SubjectName             string                `query:"subject_name"`
	GeneralType             string                `query:"general_type"`
	GeneralName             string                `query:"general_name"`
	OnlySubject             bool                  `query:"only_subject"`
	OnlySubjectAndNutrition bool                  `query:"only_subject_and_nutrition"`
}

type EvaluationSheetListEntity struct {
	ID                          int     `json:"id" db:"id"`
	FormID                      int     `json:"form_id" db:"form_id"`
	ValueType                   *int    `json:"value_type" db:"value_type"`
	EvaluationFormSubjectID     *int    `json:"evaluation_form_subject_id" db:"evaluation_form_subject_id"`
	EvaluationFormGeneralEvalID *int    `json:"evaluation_form_general_evaluation_id" db:"evaluation_form_general_evaluation_id"`
	IsLock                      *bool   `json:"is_lock" db:"is_lock"`
	Status                      *string `json:"status" db:"status"`
	SchoolID                    int     `json:"school_id" db:"school_id"`
	AcademicYear                *string `json:"academic_year" db:"academic_year"`
	Year                        *string `json:"year" db:"year"`
	SchoolRoom                  *string `json:"school_room" db:"school_room"`
	SchoolTerm                  *string `json:"school_term" db:"school_term"`
	SubjectName                 *string `json:"subject_name" db:"subject_name"`
	GeneralType                 *string `json:"general_type" db:"general_type"`
	GeneralName                 *string `json:"general_name" db:"general_name"`
}

type StudentEntity struct {
	Title               *string    `db:"title"`
	FirstName           *string    `db:"first_name"`
	LastName            *string    `db:"last_name"`
	UserID              *string    `db:"user_id"`
	SchoolID            *int       `db:"school_id"`
	StudentID           *string    `db:"student_id"`
	Year                *string    `db:"year"`
	BirthDate           *time.Time `db:"birth_date"`
	Nationality         *string    `db:"nationality"`
	Ethnicity           *string    `db:"ethnicity"`
	Religion            *string    `db:"religion"`
	FatherTitle         *string    `db:"father_title"`
	FatherFirstName     *string    `db:"father_first_name"`
	FatherLastName      *string    `db:"father_last_name"`
	MotherTitle         *string    `db:"mother_title"`
	MotherFirstName     *string    `db:"mother_first_name"`
	MotherLastName      *string    `db:"mother_last_name"`
	ParentRelationship  *string    `db:"parent_relationship"`
	ParentTitle         *string    `db:"parent_title"`
	ParentFirstName     *string    `db:"parent_first_name"`
	ParentLastName      *string    `db:"parent_last_name"`
	HouseNumber         *string    `db:"house_number"`
	Moo                 *string    `db:"moo"`
	District            *string    `db:"district"`
	SubDistrict         *string    `db:"sub_district"`
	Province            *string    `db:"province"`
	PostCode            *string    `db:"post_code"`
	ParentMaritalStatus *string    `db:"parent_marital_status"`
}
