package constant

import (
	"encoding/json"
	"time"

	"github.com/lib/pq"
)

type GradeEvaluationFormEntity struct {
	Id           *int       `json:"id" db:"id"`
	SchoolId     *int       `json:"school_id,omitempty" db:"school_id"`
	TemplateId   *int       `json:"template_id,omitempty" db:"template_id"`
	AcademicYear *string    `json:"academic_year" db:"academic_year"`
	Year         *string    `json:"year" db:"year"`
	SchoolRoom   *string    `json:"school_room" db:"school_room"`
	SchoolTerm   *string    `json:"school_term" db:"school_term"`
	IsLock       *bool      `json:"is_lock,omitempty" db:"is_lock"`
	Status       *string    `json:"status" db:"status"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
	CreatedBy    *string    `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
}

type GradeFormListEntity struct {
	Id           *int    `json:"id" db:"id"`
	TempalteId   *int    `json:"template_id" db:"template_id"`
	TemplateName *string `json:"template_name" db:"template_name"`
	AcademicYear *string `json:"academic_year" db:"academic_year"`
	Year         *string `json:"year" db:"year"`
	SchoolRoom   *string `json:"school_room" db:"school_room"`
	SchoolTerm   *string `json:"school_term" db:"school_term"`
	IsLock       *bool   `json:"is_lock" db:"is_lock"`
	Status       *string `json:"status" db:"status"`
}

type GradeEvaluationFormGeneralEvaluationEntity struct {
	Id             *int    `json:"id" db:"id"`
	FormId         *int    `json:"form_id" db:"form_id"`
	TemplateType   *string `json:"template_type" db:"template_type"`
	TemplateName   *string `json:"template_name" db:"template_name"`
	AdditionalData string  `json:"additional_data" db:"additional_data"`
}

type GradeEvaluationFormSubjectEntity struct {
	Id                *int `json:"id" db:"id"`
	FormId            *int `json:"form_id" db:"form_id"`
	SubjectTemplateId *int `json:"subject_template_id" db:"subject_template_id"`
}

type GradeEvaluationFormIndicatorEntity struct {
	Id                      *int     `json:"id" db:"id"`
	EvaluationFormSubjectId *int     `json:"evaluation_form_subject_id" db:"evaluation_form_subject_id"`
	IndicatorName           *string  `json:"indicator_name" db:"indicator_name"`
	MaxValue                *float64 `json:"max_value" db:"max_value"`
	Sort                    *int     `json:"sort" db:"sort"`
	ScoreEvaluationType     *string  `json:"score_evaluation_type" db:"score_evaluation_type"`
	CleverSubLessonId       *int     `json:"clever_sub_lesson_id" db:"clever_sub_lesson_id"`
	Weight                  *float64 `json:"weight" db:"weight"`
	LevelCount              *int     `json:"level_count" db:"level_count"`
}

type GradeEvaluationFormSettingEntity struct {
	Id                        *int     `json:"id" db:"id"`
	EvaluationFormIndicatorId *int     `json:"evaluation_form_indicator_id" db:"evaluation_form_indicator_id"`
	EvaluationKey             *string  `json:"evaluation_key" db:"evaluation_key"`
	EvaluationTopic           *string  `json:"evaluation_topic" db:"evaluation_topic"` //pre-post-test = ด่านก่อนเรียน / sub-lesson-post-test = ด่านหลังเรียน
	Value                     *string  `json:"value" db:"value"`
	Weight                    *float64 `json:"weight" db:"weight"`
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
	GradeEvaluationSubjectId         *int    `json:"subject_id" db:"subject_id"`
	GradeEvaluationSubjectTemplateId *int    `json:"template_subject_id" db:"template_subject_id"`
	SubjectName                      *string `json:"subject_name" db:"subject_name"`
}

type AdditionalPersonWithPersonDataEntity struct {
	Id        *int    `json:"-" db:"id"`
	ValueType *string `json:"-" db:"value_type"`
	ValueId   *int    `json:"-" db:"value_id"`
	UserType  *string `json:"user_type" db:"user_type"`
	UserId    *string `json:"user_id" db:"user_id"`
	Email     *string `json:"email" db:"email"`
	Title     *string `json:"title" db:"title"`
	FirstName *string `json:"first_name" db:"first_name"`
	LastName  *string `json:"last_name" db:"last_name"`
}

type EvaluationSheetEntity struct {
	ID                                *int       `json:"id" db:"id"`
	FormID                            *int       `json:"form_id" db:"form_id"`
	ValueType                         *int       `json:"value_type,omitempty" db:"value_type"`
	EvaluationFormSubjectID           *int       `json:"evaluation_form_subject_id,omitempty" db:"evaluation_form_subject_id"`
	EvaluationFormGeneralEvaluationID *int       `json:"evaluation_form_general_evaluation_id,omitempty" db:"evaluation_form_general_evaluation_id"`
	IsLock                            *bool      `json:"is_lock,omitempty" db:"is_lock"`
	Status                            *string    `json:"status" db:"status"`
	CreatedAt                         *time.Time `json:"created_at" db:"created_at"`
	CreatedBy                         *string    `json:"created_by" db:"created_by"`
	UpdatedAt                         *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy                         *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs                      *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
	CurrentDataEntryID                *int       `json:"current_data_entry_id,omitempty" db:"current_data_entry_id"`
}

type EvaluationSheetDetail struct {
	EvaluationSheetEntity
	SchoolID              int              `json:"school_id" db:"school_id"`
	AcademicYear          *string          `json:"academic_year" db:"academic_year"`
	Year                  *string          `json:"year" db:"year"`
	SchoolRoom            *string          `json:"school_room" db:"school_room"`
	SchoolTerm            *string          `json:"school_term" db:"school_term"`
	SubjectName           *string          `json:"subject_name" db:"subject_name"`
	GeneralType           *string          `json:"general_type" db:"general_type"`
	GeneralName           *string          `json:"general_name" db:"general_name"`
	GeneralAdditionalData *json.RawMessage `json:"general_additional_data" db:"general_additional_data"`
}

type EvaluationDataEntry struct {
	ID                   *int                       `json:"id" db:"id"`
	SheetID              int                        `json:"sheet_id" db:"sheet_id"`
	SheetIds             []SubjectGeneralEvaluation `json:"sheet_ids"`
	Version              string                     `json:"version" db:"version"`
	JsonStudentScoreData string                     `json:"-" db:"json_student_score_data"`
	IsLock               *bool                      `json:"is_lock,omitempty" db:"is_lock"`
	Status               *string                    `json:"status" db:"status"`
	CreatedAt            *time.Time                 `json:"created_at" db:"created_at"`
	CreatedBy            *string                    `json:"created_by" db:"created_by"`
	UpdatedAt            *time.Time                 `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy            *string                    `json:"updated_by,omitempty" db:"updated_by"`
	StartEditAt          *time.Time                 `json:"start_edit_at" db:"start_edit_at" validate:"required"`
	EndEditAt            *time.Time                 `json:"end_edit_at" db:"end_edit_at"`
	StudentScoreData     StudentScoreDataList       `json:"json_student_score_data" db:"-" validate:"required,dive,required"`
	AdditionalData       *json.RawMessage           `json:"additional_data" db:"additional_data"`
}

type SubjectGeneralEvaluation struct {
	SheetId int    `json:"id" db:"id"`
	Name    string `json:"name" db:"name"`
}

type EvaluationSheetListFilter struct {
	SubjectId           *int `query:"subject_id"`
	GeneralEvaluationId *int `query:"general_evaluation_id"`

	SchoolId     int    `query:"school_id" validate:"required"`
	FormID       int    `query:"form_id"`
	Year         string `query:"year"`
	AcademicYear string `query:"academic_year"`
	SchoolRoom   string `query:"school_room"`
	SchoolTerm   string `query:"school_term"`
	Status       string `query:"status"`
	SubjectName  string `query:"subject_name"`
	GeneralType  string `query:"general_type"`
	GeneralName  string `query:"general_name"`
	OnlySubject  bool   `query:"only_subject"`
	UserId       string
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

type EvaluationFormNote struct {
	ID        int        `json:"id" db:"id"`
	SheetID   int        `json:"sheet_id" db:"sheet_id"`
	NoteValue string     `json:"note_value,omitempty" db:"note_value"`
	Title     *string    `json:"title" db:"title"`
	FirstName *string    `json:"first_name" db:"first_name"`
	LastName  *string    `json:"last_name" db:"last_name"`
	ImageUrl  *string    `json:"image_url" db:"image_url"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy string     `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by,omitempty" db:"updated_by"`
}

type EvaluationSheetHistoryListEntity struct {
	ID               *int           `json:"id" db:"id"`
	SheetID          int            `json:"sheet_id" db:"sheet_id"`
	Version          string         `json:"version" db:"version"`
	IsLock           *bool          `json:"is_lock,omitempty" db:"is_lock"`
	Status           *string        `json:"status" db:"status"`
	UpdatedAt        *time.Time     `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string        `json:"updated_by" db:"updated_by"`
	StartEditAt      *time.Time     `json:"start_edit_at" db:"start_edit_at"`
	EndEditAt        *time.Time     `json:"end_edit_at" db:"end_edit_at"`
	UserID           *string        `json:"user_id" db:"user_id"`
	Email            *string        `json:"email" db:"email"`
	Title            *string        `json:"title" db:"title"`
	FirstName        *string        `json:"first_name" db:"first_name"`
	LastName         *string        `json:"last_name" db:"last_name"`
	UserAccessName   pq.StringArray `json:"user_access_name" db:"user_access_name"`
	IsCurrentVersion *bool          `json:"is_current_version" db:"is_current_version"`
}

type EvaluationSheetHistoryListNoDetailsEntity struct {
	Version   string     `json:"version" db:"version"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
}

type EvaluationStudentEntity struct {
	ID                  int       `json:"id" db:"id"`
	FormID              int       `json:"form_id" db:"form_id"`
	CitizenNo           *string   `json:"citizen_no" db:"citizen_no"`
	StudentID           *string   `json:"student_id" db:"student_id"`
	Title               *string   `json:"title" db:"title"`
	ThaiFirstName       *string   `json:"thai_first_name" db:"thai_first_name"`
	ThaiLastName        *string   `json:"thai_last_name" db:"thai_last_name"`
	EngFirstName        *string   `json:"eng_first_name" db:"eng_first_name"`
	EngLastName         *string   `json:"eng_last_name" db:"eng_last_name"`
	BirthDate           *string   `json:"birth_date" db:"birth_date"` // Consider using time.Time if needed
	Nationality         *string   `json:"nationality" db:"nationality"`
	Religion            *string   `json:"religion" db:"religion"`
	ParentMaritalStatus *string   `json:"parent_marital_status" db:"parent_marital_status"`
	Gender              *string   `json:"gender" db:"gender"`
	Ethnicity           *string   `json:"ethnicity" db:"ethnicity"`
	FatherTitle         *string   `json:"father_title" db:"father_title"`
	FatherFirstName     *string   `json:"father_first_name" db:"father_first_name"`
	FatherLastName      *string   `json:"father_last_name" db:"father_last_name"`
	MotherTitle         *string   `json:"mother_title" db:"mother_title"`
	MotherFirstName     *string   `json:"mother_first_name" db:"mother_first_name"`
	MotherLastName      *string   `json:"mother_last_name" db:"mother_last_name"`
	GuardianRelation    *string   `json:"guardian_relation" db:"guardian_relation"`
	GuardianTitle       *string   `json:"guardian_title" db:"guardian_title"`
	GuardianFirstName   *string   `json:"guardian_first_name" db:"guardian_first_name"`
	GuardianLastName    *string   `json:"guardian_last_name" db:"guardian_last_name"`
	AddressNo           *string   `json:"address_no" db:"address_no"`
	AddressMoo          *string   `json:"address_moo" db:"address_moo"`
	AddressSubDistrict  *string   `json:"address_sub_district" db:"address_sub_district"`
	AddressDistrict     *string   `json:"address_district" db:"address_district"`
	AddressProvince     *string   `json:"address_province" db:"address_province"`
	AddressPostalCode   *string   `json:"address_postal_code" db:"address_postal_code"`
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
	IsOut               *bool     `json:"is_out" db:"is_out"`
}

type StudentScore struct {
	EvaluationStudentId       int     `json:"evaluation_student_id" db:"evaluation_student_id"`
	EvaluationFormIndicatorID int     `json:"evaluation_form_indicator_id" db:"evaluation_form_indicator_id"`
	FormSettingID             int     `json:"-" db:"form_setting_id"`
	LevelType                 string  `json:"level_type,omitempty"`
	Score                     float64 `json:"score" db:"score"`
	MaxScore                  float64 `json:"max_score" db:"max_score"`
}

type AcademicYearRange struct {
	StartDate *time.Time `db:"start_date"`
	EndDate   *time.Time `db:"end_date"`
}

type SheetSubject struct {
	SubjectName string `json:"subject_name" db:"subject_name"`
	Year        string `json:"year" db:"year"`
	ClassName   string `json:"class_name" db:"class_name"`
}

type GradeSettingScore struct {
	EvaluationStudentId *int    `json:"evaluation_student_id" db:"evaluation_student_id"`
	SubLessonId         *int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	LevelType           *string `json:"level_type" db:"level_type"`
	Difficulty          *string `json:"difficulty" db:"difficulty"`
	Score               *int    `json:"score" db:"score"`
}

type SubLessonLevel struct {
	SubLessonId *int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	LevelType   *string `json:"level_type" db:"level_type"`
	Difficulty  *string `json:"difficulty" db:"difficulty"`
}

type LevelScoreStat struct {
	TotalScore int
	LevelCount int
}

type EvaluationFormSettingScore struct {
	Type  string  `json:"type"`
	Score float64 `json:"score"`
}
