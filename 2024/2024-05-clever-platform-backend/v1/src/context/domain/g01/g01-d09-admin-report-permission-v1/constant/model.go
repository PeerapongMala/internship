package constant

type ObserverAccessFilter struct {
	Id         *int    `query:"id"`
	Name       *string `query:"name"`
	AccessName *string `query:"access_name"`
	Status     *string `query:"status"`
}

type ObserverAccessBulkEditItem struct {
	ObserverAccessId int    `json:"observer_access_id" validate:"required"`
	Status           string `json:"status" validate:"required"`
}

type ObserverAccessSchoolFilter struct {
	ObserverAccessId  *int    `params:"observerAccessId" validate:"required"`
	Id                *int    `query:"id"`
	Code              *string `query:"code"`
	Name              *string `query:"name"`
	SchoolAffiliation *string `query:"school_affiliation"`
}

type SchoolFilter struct {
	SchoolId               *int    `query:"school_id"`
	SchoolName             *string `query:"school_name"`
	SchoolAffiliationId    *int    `query:"school_affiliation_id"`
	SchoolAffiliationGroup *string `query:"school_affiliation_group"`
}

type SchoolAffiliationFilter struct {
	SchoolAffiliationGroup *string `query:"school_affiliation_group"`
}
