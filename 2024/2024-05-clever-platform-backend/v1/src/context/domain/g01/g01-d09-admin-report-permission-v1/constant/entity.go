package constant

import "time"

type ObserverAccessEntity struct {
	Id                     *int       `json:"id" db:"id"`
	Name                   *string    `json:"name" db:"name"`
	AccessName             *string    `json:"access_name" db:"access_name"`
	DistrictZone           *string    `json:"district_zone" db:"district_zone"`
	AreaOffice             *string    `json:"area_office" db:"area_office"`
	DistrictGroup          *string    `json:"district_group" db:"district_group"`
	District               *string    `json:"district" db:"district"`
	SchoolAffiliationId    *int       `json:"school_affiliation_id" db:"school_affiliation_id"`
	SchoolAffiliationName  *string    `json:"school_affiliation_name" db:"school_affiliation_name"`
	SchoolAffiliationGroup *string    `json:"school_affiliation_group" db:"school_affiliation_group"`
	SchoolAffiliationType  *string    `json:"school_affiliation_type" db:"school_affiliation_type"`
	LaoType                *string    `json:"lao_type" db:"lao_type"`
	Status                 *string    `json:"status" db:"status"`
	CreatedAt              *time.Time `json:"created_at" db:"created_at"`
	CreatedBy              *string    `json:"created_by" db:"created_by"`
	UpdatedAt              *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy              *string    `json:"updated_by" db:"updated_by"`
}

type ObserverAccessWithSchoolsEntity struct {
	ObserverAccessEntity
	SchoolIds []int `json:"school_ids" db:"school_ids"`
}

type ObserverAccessSchoolEntity struct {
	Id                *int    `json:"id" db:"id"`
	Code              *string `json:"code" db:"code"`
	Name              *string `json:"name" db:"name"`
	SchoolAffiliation *string `json:"school_affiliation" db:"school_affiliation"`
}

type SchoolEntity struct {
	Id                    *int    `json:"id" db:"id"`
	SchoolName            *string `json:"school_name" db:"school_name"`
	SchoolAffiliationName *string `json:"school_affiliation_name" db:"school_affiliation_name"`
}

type SchoolAffiliationEntity struct {
	Id   *int    `json:"id" db:"id"`
	Name *string `json:"name" db:"name"`
}
