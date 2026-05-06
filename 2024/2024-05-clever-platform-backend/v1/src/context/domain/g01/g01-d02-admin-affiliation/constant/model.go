package constant

import "time"

type SchoolAffiliationFilter struct {
	SchoolAffiliationGroup string `query:"school_affiliation_group"`
	Type                   string `query:"type"`
	SearchText             string `query:"search_text"`
	Status                 string `query:"status"`
}

type SchoolAffiliationDoeFilter struct {
	SearchText   string `query:"search_text"`
	DistrictZone string `query:"district_zone"`
	District     string `query:"district"`
	Type         string `query:"type"`
	Status       string `query:"status"`
}

type SchoolAffiliationObecFilter struct {
	SearchText     string `query:"search_text"`
	InspectionArea string `query:"inspection_area" db:"inspection_area"`
	AreaOffice     string `query:"area_office" db:"area_office"`
	Type           string `query:"type"`
	Status         string `query:"status"`
}

type SchoolAffiliationLaoFilter struct {
	SearchText  string `query:"search_text"`
	Type        string `query:"type"`
	LaoType     string `query:"lao_type"`
	Province    string `query:"province"`
	District    string `query:"district"`
	SubDistrict string `query:"sub_district"`
	Status      string `query:"status"`
}

type ContractFilter struct {
	SearchText string     `query:"search_text"`
	Status     string     `query:"status"`
	StartDate  *time.Time `query:"start_date"`
	EndDate    *time.Time `query:"end_date"`
}

type ContractSubjectGroupFilter struct {
	SearchText        string `query:"search_text"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	YearId            int    `query:"year_id"`
	SeedYearId        int    `query:"seed_year_id"`
}

type ContractSchoolFilter struct {
	SearchText string `query:"search_text"`
}

type SubjectFilter struct {
	CurriculumGroupId int `query:"curriculum_group_id"`
	YearId            int `query:"year_id"`
	SubjectGroupId    int `query:"subject_group_id"`
}

type CurriculumGroupFilter struct {
	StartDate time.Time
	EndDate   time.Time
	Id        int    `query:"id"`
	Name      string `query:"name"`
	ShortName string `query:"short_name"`
	Status    string `query:"status"`
}

type UserFilter struct {
	CurriculumGroupId int       `query:"curriculum_group_id"`
	Id                string    `query:"id"`
	Title             string    `query:"title"`
	FirstName         string    `query:"first_name"`
	LastName          string    `query:"last_name"`
	Email             string    `query:"email"`
	StartDate         time.Time `query:"start_date"`
	EndDate           time.Time `query:"end_date"`
}

type SchoolAffiliationBulkEditItem struct {
	SchoolAffiliationId int    `json:"school_affiliation_id" validate:"required"`
	Status              string `json:"status" validate:"required"`
}

type CurriculumGroupBulkEditItem struct {
	CurriculumGroupId int    `json:"curriculum_group_id" validate:"required"`
	Status            string `json:"status" validate:"required"`
}

type SeedYearBulkEditItem struct {
	SeedYearId int    `json:"seed_year_id" validate:"required"`
	Status     string `json:"status" validate:"required"`
}

type SeedYearFilter struct {
	Id        int       `query:"id"`
	Name      string    `query:"name"`
	ShortName string    `query:"short_name"`
	Status    string    `query:"status"`
	StartDate time.Time `query:"start_date"`
	EndDate   time.Time `query:"end_date"`
}
