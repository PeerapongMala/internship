package service

type ServiceInterface interface {
	// service
	ObserverAccessCreate(in *ObserverAccessCreateInput) (*ObserverAccessCreateOutput, error)
	ObserverAccessUpdate(in *ObserverAccessUpdateInput) (*ObserverAccessUpdateOutput, error)
	ObserverAccessGet(in *ObserverAccessGetInput) (*ObserverAccessGetOutput, error)
	ObserverAccessList(in *ObserverAccessListInput) (*ObserverAccessListOutput, error)
	ObserverAccessCaseUpdateSchool(in *ObserverAccessCaseUpdateSchoolInput) (*ObserverAccessCaseUpdateSchoolOutput, error)
	ObserverAccessCaseBulkEdit(in *ObserverAccessCaseBulkEditInput) error
	ObserverAccessCaseDeleteSchool(in *ObserverAccessCaseDeleteSchoolInput) error
	ObserverAccessCaseListSchool(in *ObserverAccessCaseListSchoolInput) (*ObserverAccessCaseListSchoolOutput, error)
	SchoolList(in *SchoolListInput) (*SchoolListOutput, error)
	SchoolAffiliationList(in *SchoolAffiliationListInput) (*SchoolAffiliationListOutput, error)
	ObserverAccessCasePatchSchool(in *ObserverAccessCasePatchSchoolInput) (*ObserverAccessCasePatchSchoolOutput, error)

	//  shared service
}
