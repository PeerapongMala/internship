package constant

import (
	"time"
)

type GradeDocumentTemplate struct {
	Id              *int       `json:"id" db:"id"`
	Name            *string    `json:"name" db:"name"`
	SchoolID        int        `json:"school_id" db:"school_id"`
	FormatID        string     `json:"format_id" db:"format_id"`
	LogoImage       *string    `json:"logo_image" db:"logo_image"`
	BackgroundImage *string    `json:"background_image" db:"background_image"`
	ColourSetting   *string    `json:"colour_setting" db:"colour_setting"`
	CreatedAt       *time.Time `json:"created_at" db:"created_at"`
	CreatedBy       *string    `json:"created_by" db:"created_by"`
	UpdatedAt       *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy       *string    `json:"updated_by,omitempty" db:"updated_by"`
	IsDefault       *bool      `json:"is_default" db:"is_default"`
}

type EvaluationStudent struct {
	ID                     int      `json:"id" db:"id" valid:"required"`
	FormID                 int      `json:"form_id" db:"form_id"`
	CitizenNo              *string  `json:"citizen_no,omitempty" db:"citizen_no"`
	StudentID              *string  `json:"student_id,omitempty" db:"student_id"`
	AcademicYear           *string  `json:"academic_year" db:"academic_year"`
	Gender                 *string  `json:"gender,omitempty" db:"gender"`
	Title                  *string  `json:"title,omitempty" db:"title"`
	ThaiFirstName          *string  `json:"thai_first_name,omitempty" db:"thai_first_name"`
	ThaiLastName           *string  `json:"thai_last_name,omitempty" db:"thai_last_name"`
	EngFirstName           *string  `json:"eng_first_name,omitempty" db:"eng_first_name"`
	EngLastName            *string  `json:"eng_last_name,omitempty" db:"eng_last_name"`
	BirthDate              *string  `json:"birth_date,omitempty" db:"birth_date"`
	Ethnicity              *string  `json:"ethnicity,omitempty" db:"ethnicity"`
	Nationality            *string  `json:"nationality,omitempty" db:"nationality"`
	Religion               *string  `json:"religion,omitempty" db:"religion"`
	ParentMaritalStatus    *string  `json:"parent_marital_status,omitempty" db:"parent_marital_status"`
	FatherTitle            *string  `json:"father_title,omitempty" db:"father_title"`
	FatherFirstName        *string  `json:"father_first_name,omitempty" db:"father_first_name"`
	FatherLastName         *string  `json:"father_last_name,omitempty" db:"father_last_name"`
	MotherTitle            *string  `json:"mother_title,omitempty" db:"mother_title"`
	MotherFirstName        *string  `json:"mother_first_name,omitempty" db:"mother_first_name"`
	MotherLastName         *string  `json:"mother_last_name,omitempty" db:"mother_last_name"`
	GuardianRelation       *string  `json:"guardian_relation,omitempty" db:"guardian_relation"`
	GuardianTitle          *string  `json:"guardian_title,omitempty" db:"guardian_title"`
	GuardianFirstName      *string  `json:"guardian_first_name,omitempty" db:"guardian_first_name"`
	GuardianLastName       *string  `json:"guardian_last_name,omitempty" db:"guardian_last_name"`
	AddressNo              *string  `json:"address_no,omitempty" db:"address_no"`
	AddressMoo             *string  `json:"address_moo,omitempty" db:"address_moo"`
	AddressSubDistrict     *string  `json:"address_sub_district,omitempty" db:"address_sub_district"`
	AddressDistrict        *string  `json:"address_district,omitempty" db:"address_district"`
	AddressProvince        *string  `json:"address_province,omitempty" db:"address_province"`
	AddressPostalCode      *string  `json:"address_postal_code,omitempty" db:"address_postal_code"`
	Year                   *string  `json:"year" db:"year"`
	SchoolRoom             *string  `json:"school_room" db:"school_room"`
	IsOut                  *bool    `json:"is_out" db:"is_out"`
	MasterStudentID        *string  `json:"master_student_id" db:"master_student_id"`
	MasterStudentTitle     *string  `json:"master_student_title" db:"master_student_title"`
	MasterStudentFirstName *string  `json:"master_student_first_name" db:"master_student_first_name"`
	MasterStudentLastName  *string  `json:"master_student_last_name" db:"master_student_last_name"`
	MatchInMasterData      *bool    `json:"match_in_master_data" db:"match_in_master_data"`
	UnmatchedFields        []string `json:"unmatched_fields" db:"unmatched_fields"`
}

type GradeEvaluationStudentFilter struct {
	SchoolID     *int    `query:"school_id" validate:"required"`
	FormID       *int    `query:"form_id"`
	AcademicYear *string `query:"academic_year"`
	Year         *string `query:"year"`
	SchoolRoom   *string `query:"school_room"`
	StudentID    *int    `query:"student_id"`
	SearchText   *string `query:"search_text"`
}

type GradeEvaluationStudentFilterResult struct {
	EvaluationStudent
	AcademicYear *string `json:"academic_year" db:"academic_year"`
	Year         *string `json:"year" db:"year"`
	SchoolRoom   *string `json:"school_room" db:"school_room"`
	SchoolTerm   *string `json:"school_term" db:"school_term"`
	SchoolCode   *string `json:"school_code" db:"school_code"`
	SchoolName   *string `json:"school_name" db:"school_name"`

	// สำหรับปุ่ม Custom/แดงเขียว
	MasterStudentID        *string  `json:"master_student_id" db:"master_student_id"`
	MasterStudentTitle     *string  `json:"master_student_title" db:"master_student_title"`
	MasterStudentFirstName *string  `json:"master_student_first_name" db:"master_student_first_name"`
	MasterStudentLastName  *string  `json:"master_student_last_name" db:"master_student_last_name"`
	MatchInMasterData      *bool    `json:"match_in_master_data" db:"match_in_master_data"`
	UnmatchedFields        []string `json:"unmatched_fields" db:"unmatched_fields"`
}

type StudentAddressResult struct {
	ID                 int     `json:"id" db:"id" valid:"required"`
	FormID             int     `json:"form_id" db:"form_id"`
	CitizenNo          *string `json:"citizen_no,omitempty" db:"citizen_no"`
	StudentID          *string `json:"student_id,omitempty" db:"student_id"`
	Gender             *string `json:"gender,omitempty" db:"gender"`
	Title              *string `json:"title,omitempty" db:"title"`
	ThaiFirstName      *string `json:"thai_first_name,omitempty" db:"thai_first_name"`
	ThaiLastName       *string `json:"thai_last_name,omitempty" db:"thai_last_name"`
	EngFirstName       *string `json:"eng_first_name,omitempty" db:"eng_first_name"`
	EngLastName        *string `json:"eng_last_name,omitempty" db:"eng_last_name"`
	AddressNo          *string `json:"address_no,omitempty" db:"address_no"`
	AddressMoo         *string `json:"address_moo,omitempty" db:"address_moo"`
	AddressSubDistrict *string `json:"address_sub_district,omitempty" db:"address_sub_district"`
	AddressDistrict    *string `json:"address_district,omitempty" db:"address_district"`
	AddressProvince    *string `json:"address_province,omitempty" db:"address_province"`
	AddressPostalCode  *string `json:"address_postal_code,omitempty" db:"address_postal_code"`
}
