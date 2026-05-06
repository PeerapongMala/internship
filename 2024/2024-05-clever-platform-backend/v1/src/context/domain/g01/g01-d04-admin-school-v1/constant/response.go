package constant

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

type SchoolResponse struct {
	Id                         int     `db:"id" json:"id"`
	ImageUrl                   *string `db:"image_url" json:"image_url"`
	Name                       string  `db:"name" json:"name" validate:"required"`
	Address                    string  `db:"address" json:"address" validate:"required"`
	Region                     string  `db:"region" json:"region" validate:"required"`
	Province                   string  `db:"province" json:"province" validate:"required"`
	District                   string  `db:"district" json:"district" validate:"required"`
	SubDistrict                string  `db:"sub_district" json:"sub_district" validate:"required"`
	PostCode                   string  `db:"post_code" json:"post_code" validate:"required"`
	Latitude                   *string `db:"latitude" json:"latitude"`
	Longtitude                 *string `db:"longtitude" json:"longtitude"`
	Director                   *string `db:"director" json:"director"`
	DirectorPhone              *string `db:"director_phone_number" json:"director_phone_number"`
	DeputyDirector             *string `db:"deputy_director" json:"deputy_director"`
	DeputyDirectorPhone        *string `db:"deputy_director_phone" json:"deputy_director_phone"`
	Registrar                  *string `db:"registrar" json:"registrar"`
	RegistrarPhone             *string `db:"registrar_phone_number" json:"registrar_phone_number"`
	AcademicAffairHead         *string `db:"academic_affair_head" json:"academic_affair_head"`
	AcademicAffairHeadPhone    *string `db:"academic_affair_head_phone_number" json:"academic_affair_head_phone_number"`
	Advisor                    *string `db:"advisor" json:"advisor"`
	AdvisorPhone               *string `db:"advisor_phone_number" json:"advisor_phone_number"`
	Status                     string  `db:"status" json:"status"`
	CreatedAt                  string  `db:"created_at" json:"created_at"`
	CreatedBy                  string  `db:"created_by" json:"created_by"`
	UpdatedAt                  *string `db:"updated_at" json:"updated_at"`
	UpdatedBy                  *string `db:"updated_by" json:"updated_by"`
	Code                       *string `db:"code" json:"code"`
	SchoolAffiliationId        *int    `db:"school_affiliation_id" json:"school_affiliation_id"`
	SchoolAffiliationGroup     *string `db:"school_affiliation_group" json:"school_affiliation_group"`
	SchoolAffiliationType      *string `db:"school_affiliation_type" json:"school_affiliation_type"`
	SchoolAffiliationName      *string `db:"school_affiliation_name" json:"school_affiliation_name"`
	SchoolAffiliationShortName *string `db:"school_affiliation_short_name" json:"school_affiliation_short_name"`
	LaoType                    *string `db:"lao_type" json:"lao_type"`
	LaoProvince                *string `db:"lao_province" json:"lao_province"`
	LaoDistrict                *string `db:"lao_district" json:"lao_district"`
	LaoSubDistrict             *string `db:"lao_sub_district" json:"lao_sub_district"`
	ObecInspectionArea         *string `db:"obec_inspection_area" json:"obec_inspection_area"`
	ObecAreaOffice             *string `db:"obec_area_office" json:"obec_area_office"`
	DoeDistrictZone            *string `db:"doe_district_zone" json:"doe_district_zone"`
	DoeDistrict                *string `db:"doe_district" json:"doe_district"`
}

type SchoolContractsResponse struct {
	SchoolId              int     `db:"school_id" json:"school_id"`
	SchoolName            string  `db:"school_name" json:"school_name"`
	ContractId            int     `db:"contract_id" json:"contract_id"`
	ContractName          string  `db:"contract_name" json:"contract_name"`
	SchoolAffiliationId   int     `db:"school_affiliation_id" json:"school_affiliation_id"`
	SchoolAffiliationName string  `db:"school_afiliation_name" json:"school_affiliation_name"`
	StartDate             string  `db:"start_date" json:"start_date"`
	EndDate               string  `db:"end_date" json:"end_date"`
	Status                string  `db:"contract_status" json:"contract_status"`
	CreatedAt             string  `db:"created_at" json:"created_at"`
	CreatedBy             string  `db:"created_by" json:"created_by"`
	UpdatedAt             *string `db:"updated_at" json:"updated_at"`
	UpdatedBy             *string `db:"updated_by" json:"updated_by"`
}
type SchoolContractsSubjectGroupResponse struct {
	SubjectId           int     `db:"subject_id" json:"subject_id"`
	SubjectName         string  `db:"subject_name" json:"subject_name"`
	SubjectGroupId      int     `db:"subject_group_id" json:"subject_group_id"`
	CurriculumGroupId   int     `db:"curriculum_group_id" json:"curriculum_group_id"`
	CurriculumGroupName string  `db:"curriculum_group_name" json:"curriculum_group_name"`
	SubjectGroupName    string  `db:"subject_group_name" json:"subject_group_name"`
	SeedYearName        string  `db:"seed_year_name" json:"seed_year_name"`
	Status              string  `db:"status" json:"status"`
	CreatedAt           string  `db:"created_at" json:"created_at"`
	CreatedBy           string  `db:"created_by" json:"created_by"`
	UpdatedAt           *string `db:"updated_at" json:"updated_at"`
	UpdatedBy           *string `db:"updated_by" json:"updated_by"`
}
type SchoolListResponse struct {
	Id                         int     `db:"id" json:"id"`
	Code                       *string `db:"code" json:"code"`
	Name                       string  `db:"name" json:"name"`
	Province                   string  `db:"province" json:"province"`
	SchoolAffiliationId        *int    `db:"school_affiliation_id" json:"school_affiliation_id"`
	SchoolAffiliationType      *string `db:"school_affiliation_type" json:"school_affiliation_type"`
	SchoolAffiliationName      *string `db:"school_affiliation_name" json:"school_affiliation_name"`
	SchoolAffiliationShortName *string `db:"school_affiliation_short_name" json:"school_affiliation_short_name"`
	Status                     string  `db:"status" json:"status"`
	Contracts                  int     `db:"contract_count" json:"contract_count"`
	CreatedAt                  string  `db:"created_at" json:"created_at"`
	CreatedBy                  string  `db:"created_by" json:"created_by"`
	UpdatedAt                  *string `db:"updated_at" json:"updated_at"`
	UpdatedBy                  *string `db:"updated_by" json:"updated_by"`
}

type SchoolAffiliationList struct {
	Id                     int     `db:"id" json:"id"`
	SchoolAffiliationGroup string  `db:"school_affiliation_group" json:"school_affiliation_group"`
	Type                   string  `db:"type" json:"type"`
	Name                   string  `db:"name" json:"name"`
	ShortName              string  `db:"short_name" json:"short_name"`
	LaoType                *string `db:"lao_type" json:"lao_type"`
	LaoProvince            *string `db:"lao_province" json:"lao_province"`
	LaoDistrict            *string `db:"lao_district" json:"lao_district"`
	LaoSubDistrict         *string `db:"lao_sub_district" json:"lao_sub_district"`
	ObecInspectionArea     *string `db:"obec_inspection_area" json:"obec_inspection_area"`
	ObecAreaOffice         *string `db:"obec_area_office" json:"obec_area_office"`
	DoeDistrictZone        *string `db:"doe_district_zone" json:"doe_district_zone"`
	DoeDistrict            *string `db:"doe_district" json:"doe_district"`
}
type SchoolAffilation struct {
	Id                     int     `db:"id" json:"id"`
	SchoolAffiliationGroup string  `db:"school_affiliation_group" json:"school_affiliation_group"`
	Type                   string  `db:"type" json:"type"`
	Name                   string  `db:"name" json:"name"`
	ShortName              string  `db:"short_name" json:"short_name"`
	Status                 string  `db:"status" json:"status"`
	CreatedAt              string  `db:"created_at" json:"created_at"`
	CreatedBy              string  `db:"created_by" json:"created_by"`
	UpdatedAt              *string `db:"updated_at" json:"updated_at"`
	UpdatedBy              *string `db:"updated_by" json:"updated_by"`
}

type SchoolResponseCsv struct {
	Id                      int     `db:"id" json:"id"`
	Code                    string  `db:"code" json:"code"`
	SchoolAffiliationName   *string `db:"school_affiliation_name" json:"school_affiliation_name"`
	Name                    string  `db:"name" json:"name"`
	Address                 string  `db:"address" json:"address"`
	Region                  string  `db:"region" json:"region"`
	Province                string  `db:"province" json:"province"`
	District                string  `db:"district" json:"district"`
	SubDistrict             string  `db:"sub_district" json:"sub_district"`
	PostCode                string  `db:"post_code" json:"post_code"`
	Latitude                *string `db:"latitude" json:"latitude"`
	Longtitude              *string `db:"longtitude" json:"longtitude"`
	Director                *string `db:"director" json:"director"`
	DirectorPhone           *string `db:"director_phone_number" json:"director_phone_number"`
	Registrar               *string `db:"registrar" json:"registrar"`
	RegistrarPhone          *string `db:"registrar_phone_number" json:"registrar_phone_number"`
	AcademicAffairHead      *string `db:"academic_affair_head" json:"academic_affair_head"`
	AcademicAffairHeadPhone *string `db:"academic_affair_head_phone_number" json:"academic_affair_head_phone_number"`
	Advisor                 *string `db:"advisor" json:"advisor"`
	AdvisorPhone            *string `db:"advisor_phone_number" json:"advisor_phone_number"`
	CreatedAt               string  `db:"created_at" json:"created_at"`
	Status                  string  `db:"status" json:"status"`
}

type SubjectResponse struct {
	Id                  int    `db:"id" json:"subject_id"`
	Platfrom            string `db:"platform_name" json:"platform_name"`
	Name                string `db:"name" json:"subject_name"`
	SubjectGroupId      int    `db:"subject_group_id" json:"subject_group_id"`
	SubjectGroupName    string `db:"subject_group_name" json:"subject_group_name"`
	YearId              int    `db:"year_id" json:"year_id"`
	SeedYearName        string `db:"seed_year_name" json:"seed_year_name"`
	CurriculumGroupId   int    `db:"curriculum_group_id" json:"curriculum_group_id"`
	CurriculumGroupName string `db:"curriculum_group_name" json:"curriculum_group_name"`
	Status              string `db:"status" json:"status"`
	CreatedAt           string `db:"created_at" json:"created_at"`
	CreatedBy           string `db:"created_by" json:"created_by"`
	UpdatedAt           string `db:"updated_at" json:"updated_at"`
	UpdatedBy           string `db:"updated_by" json:"updated_by"`
}
type ContractsSubjectGroup struct {
	ContractId          int     `db:"contract_id" json:"contract_id"`
	ContractName        string  `db:"contract_name" json:"contract_name"`
	SubjectId           int     `db:"subject_id" json:"subject_id"`
	SubjectName         string  `db:"subject_name" json:"subject_name"`
	SubjectGroupId      int     `db:"subject_group_id" json:"subject_group_id"`
	SubjectGroupName    string  `db:"subject_group_name" json:"subject_group_name"`
	CurriculumGroupId   int     `db:"curriculum_group_id" json:"curriculum_group_id"`
	CurriculumGroupName string  `db:"curriculum_group_name" json:"curriculum_group_name"`
	YearId              int     `db:"year_id" json:"year_id"`
	SeedYearName        string  `db:"seed_year_short_name" json:"seed_year_short_name"`
	Status              string  `db:"status" json:"status"`
	CreatedAt           string  `db:"created_at" json:"created_at"`
	CreatedBy           string  `db:"created_by" json:"created_by"`
	UpdatedAt           *string `db:"updated_at" json:"updated_at"`
	UpdatedBy           *string `db:"updated_by" json:"updated_by"`
}

type ProvinceList struct {
	Province string `db:"province" json:"province"`
}

type SchoolAffiliationDoeList struct {
	SchoolAffilationId    int    `db:"school_affiliation_doe_id" json:"school_affiliation_doe_id"`
	SchoolAffiliationName string `db:"school_affiliation_doe_name" json:"school_affiliation_doe_name"`
}
type StatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

type DataResponse struct {
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

type ListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       interface{}        `json:"data"`
	Message    string             `json:"message"`
}
