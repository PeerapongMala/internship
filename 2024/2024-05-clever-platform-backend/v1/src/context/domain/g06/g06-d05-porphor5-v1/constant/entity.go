package constant

import (
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
	Id           *int    `json:"id" db:"id"`
	FormId       *int    `json:"form_id" db:"form_id"`
	TemplateType *string `json:"template_type" db:"template_type"`
	TemplateName *string `json:"template_name" db:"template_name"`
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
}

type GradeEvaluationFormSettingEntity struct {
	Id                        *int    `json:"id" db:"id"`
	EvaluationFormIndicatorId *int    `json:"evaluation_form_indicator_id" db:"evaluation_form_indicator_id"`
	EvaluationKey             *string `json:"evaluation_key" db:"evaluation_key"`
	EvaluationTopic           *string `json:"evaluation_topic" db:"evaluation_topic"`
	Value                     *string `json:"value" db:"value"`
	Weight                    *int    `json:"weight" db:"weight"`
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

type EvaluationDataEntry struct {
	ID                   *int                 `json:"id" db:"id"`
	SheetID              int                  `json:"sheet_id" db:"sheet_id"`
	Version              string               `json:"version" db:"version"`
	JsonStudentScoreData string               `json:"-" db:"json_student_score_data"`
	IsLock               *bool                `json:"is_lock,omitempty" db:"is_lock"`
	Status               *string              `json:"status" db:"status"`
	CreatedAt            *time.Time           `json:"created_at" db:"created_at"`
	CreatedBy            *string              `json:"created_by" db:"created_by"`
	UpdatedAt            *time.Time           `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy            *string              `json:"updated_by,omitempty" db:"updated_by"`
	StartEditAt          *time.Time           `json:"start_edit_at" db:"start_edit_at" validate:"required"`
	EndEditAt            *time.Time           `json:"end_edit_at" db:"end_edit_at"`
	StudentScoreData     StudentScoreDataList `json:"json_student_score_data" db:"-" validate:"required,dive,required"`
}

type EvaluationSheetListFilter struct {
	SubjectId           *int `query:"subject_id"`
	GeneralEvaluationId *int `query:"general_evaluation_id"`

	SchoolId     int    `query:"school_id" validate:"required"`
	Year         string `query:"year"`
	AcademicYear string `query:"academic_year"`
	SchoolRoom   string `query:"school_room"`
	SchoolTerm   string `query:"school_term"`
	Status       string `query:"status"`
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
	GeneralName                 *string `json:"general_name" db:"general_name"`
}

type EvaluationFormNote struct {
	ID        int        `json:"id" db:"id"`
	SheetID   int        `json:"sheet_id" db:"sheet_id"`
	NoteValue string     `json:"note_value,omitempty" db:"note_value"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy string     `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by,omitempty" db:"updated_by"`
}

type EvaluationSheetHistoryListEntity struct {
	ID               *int       `json:"id" db:"id"`
	SheetID          int        `json:"sheet_id" db:"sheet_id"`
	Version          string     `json:"version" db:"version"`
	IsLock           *bool      `json:"is_lock,omitempty" db:"is_lock"`
	Status           *string    `json:"status" db:"status"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by" db:"updated_by"`
	StartEditAt      *time.Time `json:"start_edit_at" db:"start_edit_at"`
	EndEditAt        *time.Time `json:"end_edit_at" db:"end_edit_at"`
	UserID           *string    `json:"user_id" db:"user_id"`
	Email            *string    `json:"email" db:"email"`
	Title            *string    `json:"title" db:"title"`
	FirstName        *string    `json:"first_name" db:"first_name"`
	LastName         *string    `json:"last_name" db:"last_name"`
	IsCurrentVersion *bool      `json:"is_current_version" db:"is_current_version"`
}

type Porphor5DataEntity struct {
	ID             int              `json:"id" db:"id"`
	FormID         int              `json:"form_id" db:"form_id"`
	Order          int              `json:"order" db:"order"`
	Name           Porphor5Category `json:"name" db:"name"`
	DataJson       string           `json:"data_json,omitempty" db:"data_json"`
	CreatedAt      time.Time        `json:"created_at" db:"created_at"`
	Mode           map[string][]int `json:"mode"`
	AdditionalData *string          `json:"additional_data" db:"additional_data"`
}

type Porphor6DataEntity struct {
	ID             int       `json:"id" db:"id"`
	FormID         int       `json:"form_id" db:"form_id"`
	Order          int       `json:"order" db:"order"`
	SchoolAddress  *string   `json:"school_address" db:"school_address"`
	SchoolProvince *string   `json:"province" db:"school_province"`
	StudentID      int       `json:"student_id" db:"student_id"`
	DataJson       string    `json:"data_json,omitempty" db:"data_json"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

type Porphor6Data struct {
	Porphor6DataEntity
	StudentIdNo   string  `json:"student_id_no" db:"student_id_no"`
	Title         *string `json:"title" db:"title"`
	ThaiFirstName *string `json:"thai_first_name" db:"thai_first_name"`
	ThaiLastName  *string `json:"thai_last_name" db:"thai_last_name"`
	EngFirstName  *string `json:"eng_first_name" db:"eng_first_name"`
	EngLastName   *string `json:"eng_last_name" db:"eng_last_name"`
	AcademicYear  string  `json:"academic_year" db:"academic_year"`
	Year          string  `json:"year" db:"year"`
	SchoolRoom    string  `json:"school_room" db:"school_room"`
	AgeYear       int     `json:"age_year"`
	AgeMonth      int     `json:"age_month"`
	NormalCredits int     `json:"normal_credits"`
	ExtraCredits  int     `json:"extra_credits"`
	TotalCredits  int     `json:"total_credits"`
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

type SubjectDataDetail struct {
	Id             int            `json:"id" db:"id"`
	Code           *string        `json:"code" db:"code"`
	Credits        int            `json:"credits" db:"credits"`
	SubjectName    *string        `json:"subject_name" db:"subject_name"`
	Hours          *int           `json:"hours" db:"hours"`
	TotalScore     float64        `json:"total_score" db:"total_score"`
	LearningArea   *string        `json:"learning_area" db:"learning_area"`
	LearningGroup  *string        `json:"learning_group" db:"learning_group"`
	GeneralType    *string        `json:"general_type" db:"general_type"`
	GeneralName    *string        `json:"general_name" db:"general_name"`
	SchoolName     *string        `db:"school_name"`
	SchoolArea     *string        `db:"school_area"` //สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1
	Teacher        pq.StringArray `json:"teacher" db:"teacher"`
	TeacherAdvisor pq.StringArray `json:"teacher_advisor" db:"teacher_advisor"`
	Type           *string        `json:"type" db:"type"`
}

type FormDataDetail struct {
	Id         int     `json:"id" db:"id"`
	SchoolName *string `db:"school_name"`
	SchoolArea *string `db:"school_area"` //สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1
}

type Porphor6ListFilter struct {
	EvaluationFormId int    `params:"evaluationFormId" validate:"required"`
	SearchText       string `query:"search_text"`
}
