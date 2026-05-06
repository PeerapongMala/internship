package constant

import (
	"time"
)

type SchoolAffiliationEntity struct {
	Id                     int        `json:"id" db:"id"`
	SchoolAffiliationGroup string     `json:"school_affiliation_group" db:"school_affiliation_group"`
	Type                   string     `json:"type,omitempty" db:"type"`
	Name                   string     `json:"name" db:"name"`
	ShortName              *string    `json:"short_name" db:"short_name"`
	Status                 string     `json:"status" db:"status"`
	CreatedAt              time.Time  `json:"created_at" db:"created_at"`
	CreatedBy              string     `json:"created_by" db:"created_by"`
	UpdatedAt              *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy              *string    `json:"updated_by" db:"updated_by"`
}

type SchoolAffiliationDoeEntity struct {
	SchoolAffiliationId int    `json:"-" db:"school_affiliation_id"`
	DistrictZone        string `json:"district_zone" db:"district_zone"`
	District            string `json:"district" db:"district"`
}

type SchoolAffiliationObecEntity struct {
	SchoolAffiliationId int    `json:"-" db:"school_affiliation_id"`
	InspectionArea      string `json:"inspection_area" db:"inspection_area"`
	AreaOffice          string `json:"area_office" db:"area_office"`
}

type SchoolAffiliationLaoEntity struct {
	SchoolAffiliationId int    `json:"-" db:"school_affiliation_id"`
	LaoType             string `json:"lao_type" db:"lao_type"`
	District            string `json:"district" db:"district"`
	SubDistrict         string `json:"sub_district" db:"sub_district"`
	Province            string `json:"province" db:"province"`
}

type SchoolAffiliationDoeDataEntity struct {
	*SchoolAffiliationEntity
	*SchoolAffiliationDoeEntity
}

type SchoolAffiliationObecDataEntity struct {
	*SchoolAffiliationEntity
	*SchoolAffiliationObecEntity
}

type SchoolAffiliationLaoDataEntity struct {
	*SchoolAffiliationEntity
	*SchoolAffiliationLaoEntity
}

type ContractEntity struct {
	Id                  int        `json:"id" db:"id"`
	SeedPlatformId      *int       `json:"seed_platform_id,omitempty" db:"seed_platform_id"`
	SeedPlatformName    *string    `json:"seed_platform_name,omitempty" db:"seed_platform_name"`
	SeedProjectId       *int       `json:"seed_project_id,omitempty" db:"seed_project_id"`
	SeedProjectName     *string    `json:"seed_project_name,omitempty" db:"seed_project_name"`
	SchoolAffiliationId int        `json:"school_affiliation_id" db:"school_affiliation_id"`
	Name                string     `json:"name" db:"name"`
	StartDate           time.Time  `json:"start_date" db:"start_date"`
	EndDate             time.Time  `json:"end_date" db:"end_date"`
	Status              string     `json:"status" db:"status"`
	WizardIndex         int        `json:"wizard_index" db:"wizard_index"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
}

type SeedPlatformEntity struct {
	Id   string `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type ContractSubjectGroupEntity struct {
	SubjectGroupId int   `json:"subject_group_id" validate:"required"`
	IsEnabled      *bool `json:"is_enabled" validate:"required"`
}

type ContractWithSchoolCountEntity struct {
	*ContractEntity
	SchoolCount int `json:"school_count" db:"school_count"`
}

type ContractSubjectGroupDataEntity struct {
	Id              int        `json:"id" db:"id"`
	CurriculumGroup string     `json:"curriculum_group" db:"curriculum_group"`
	SubjectGroup    string     `json:"subject_group" db:"subject_group"`
	Year            string     `json:"year" db:"year"`
	PlatformName    *string    `json:"platform_name" db:"platform_name"`
	Subjects        []string   `json:"subjects" db:"subjects"`
	UpdatedAt       *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy       *string    `json:"updated_by" db:"updated_by"`
	IsEnabled       bool       `json:"is_enabled" db:"is_enabled"`
}

type ContractSchoolDataEntity struct {
	Id                    int    `json:"id" db:"id"`
	Code                  string `json:"school_code" db:"code"`
	Name                  string `json:"school_name" db:"name"`
	SchoolAffiliationId   int    `json:"-" db:"school_affiliation_id"`
	SchoolAffiliationType string `json:"school_affiliation_type" db:"school_affiliation_type"`
}

type ContractSchoolDoeDataEntity struct {
	ContractSchoolDataEntity
	DistrictZone string `json:"district_zone" db:"district_zone"`
	District     string `json:"district" db:"district"`
}

type ContractSchoolObecDataEntity struct {
	ContractSchoolDataEntity
	InspectionArea string `json:"inspection_area" db:"inspection_area"`
	AreaOffice     string `json:"area_office" db:"area_office"`
}

type ContractSchoolLaoDataEntity struct {
	ContractSchoolDataEntity
	LaoType     string `json:"lao_type" db:"lao_type"`
	District    string `json:"district" db:"district"`
	SubDistrict string `json:"sub_district" db:"sub_district"`
	Province    string `json:"province" db:"province"`
}

type SubjectListDataEntity struct {
	Id              int    `json:"id" db:"id"`
	CurriculumGroup string `json:"curriculum_group" db:"curriculum_group"`
	Year            string `json:"year" db:"year"`
	Name            string `json:"name" db:"name"`
}

type CurriculumGroupEntity struct {
	Id        int        `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	ShortName string     `json:"short_name" db:"short_name"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy string     `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
}

type SubCriteriaEntity struct {
	Id                int        `json:"id" db:"id"`
	CurriculumGroupId int        `json:"curriculum_group_id" db:"curriculum_group_id"`
	Index             int        `json:"index" db:"index"`
	Name              string     `json:"name" db:"name"`
	UpdatedAt         *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string    `json:"admin_login_as" db:"admin_login_as"`
}

type YearEntity struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	ShortName string `json:"short_name" db:"short_name"`
}

type SubjectGroupEntity struct {
	Id              int      `json:"id" db:"id"`
	CurriculumGroup string   `json:"curriculum_group" db:"curriculum_group"`
	Year            string   `json:"year" db:"year"`
	Name            string   `json:"subject_group" db:"name"`
	Subjects        []string `json:"subjects" db:"subjects"`
}

type UserEntity struct {
	Id        string     `json:"id" db:"id"`
	Email     string     `json:"email" db:"email"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	IdNumber  *string    `json:"id_number" db:"id_number"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
}

type SeedYearEntity struct {
	Id        int        `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	ShortName string     `json:"short_name" db:"short_name"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy string     `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
}
