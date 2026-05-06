package service

type ServiceInterface interface {
	SchoolAffiliationCreate(in *SchoolAffiliationCreateInput) (*SchoolAffiliationCreateOutput, error)
	SchoolAffiliationGet(in *SchoolAffiliationGetInput) (*SchoolAffiliationOutput, error)
	SchoolAffiliationUpdate(in *SchoolAffiliationUpdateInput) (*SchoolAffiliationCreateOutput, error)
	SchoolAffiliationList(in *SchoolAffiliationListInput) (*SchoolAffiliationListOutput, error)
	SchoolAffiliationCaseListContract(in *SchoolAffiliationCaseListContractInput) (*SchoolAffiliationCaseListContractOutput, error)
	SchoolAffiliationCaseBulkEdit(in *SchoolAffiliationCaseBulkEditInput) error
	SchoolAffiliationCaseDownloadCsv(in *SchoolAffiliationCaseDownloadCsvInput) (*SchoolAffiliationCaseDownloadCsvOutput, error)
	SchoolAffiliationCaseUploadCsv(in *SchoolAffiliationCaseUploadCsvInput) error

	SchoolAffiliationDoeCreate(*SchoolAffiliationDoeCreateInput) (*SchoolAffiliationDoeCreateOutput, error)
	SchoolAffiliationDoeUpdate(in *SchoolAffiliationDoeUpdateInput) (*SchoolAffiliationDoeUpdateOutput, error)
	SchoolAffiliationDoeList(in *SchoolAffiliationDoeListInput) (*SchoolAffiliationDoeListOutput, error)

	SchoolAffiliationLaoCreate(in *SchoolAffiliationLaoCreateInput) (*SchoolAffiliationLaoCreateOutput, error)
	SchoolAffiliationLaoUpdate(in *SchoolAffiliationLaoUpdateInput) (*SchoolAffiliationLaoUpdateOutput, error)
	SchoolAffiliationLaoList(in *SchoolAffiliationLaoListInput) (*SchoolAffiliationLaoListOutput, error)

	SchoolAffiliationObecCreate(in *SchoolAffiliationObecCreateInput) (*SchoolAffiliationObecCreateOutput, error)
	SchoolAffiliationObecUpdate(in *SchoolAffiliationObecUpdateInput) (*SchoolAffiliationObecUpdateOutput, error)
	SchoolAffiliationObecList(in *SchoolAffiliationObecListInput) (*SchoolAffiliationObecListOutput, error)

	ContractCreate(in *ContractCreateInput) (*ContractCreateOutput, error)
	ContractGet(in *ContractGetInput) (*ContractGetOutput, error)
	ContractUpdate(in *ContractUpdateInput) (*ContractUpdateOutput, error)
	ContractCaseAddSchool(in *ContractCaseAddSchoolInput) (*ContractCaseAddSchoolOutput, error)
	ContractCaseDeleteSchool(in *ContractCaseDeleteSchoolInput) (*ContractCaseDeleteSchoolOutput, error)
	ContractCaseAddSubjectGroup(in *ContractCaseAddSubjectGroupInput) (*ContractCaseAddSubjectGroupOutput, error)
	ContractCaseDeleteSubjectGroup(in *ContractCaseDeleteSubjectGroupInput) (*ContractCaseDeleteSubjectGroupOutput, error)
	ContractCaseListSubjectGroup(in *ContractCaseListSubjectGroupInput) (*ContractCaseListSubjectGroupOutput, error)
	ContractCaseListSchool(in *ContractCaseListSchoolInput) (*ContractCaseListSchoolOutput, error)
	ContractCaseToggleSubjectGroup(in *ContractCaseToggleSubjectGroupInput) error

	SubjectList(in *SubjectListInput) (*SubjectListOutput, error)
	CurriculumGroupList(in *CurriculumGroupListInput) (*CurriculumGroupListOutput, error)
	YearList(in *YearListInput) (*YearListOutput, error)
	SubjectGroupList(in *SubjectGroupListInput) (*SubjectGroupListOutput, error)

	SchoolCaseListBySchoolAffiliation(in *SchoolCaseListBySchoolAffiliationInput) (*SchoolCaseListBySchoolAffiliationOutput, error)

	CurriculumGroupCaseBulkEdit(in *CurriculumGroupCaseBulkEditInput) error
	CurriculumGroupCaseDownloadCsv(in *CurriculumGroupCaseDownloadCsvInput) (*CurriculumGroupCaseDownloadCsvOutput, error)
	CurriculumGroupCaseUploadCsv(in *CurriculumGroupCaseUploadCsvInput) error
	CurriculumGroupCreate(in *CurriculumGroupCreateInput) (*CurriculumGroupCreateOutput, error)
	CurriculumGroupGet(in *CurriculumGroupGetInput) (*CurriculumGroupGetOutput, error)
	CurriculumGroupUpdate(in *CurriculumGroupUpdateInput) (*CurriculumGroupUpdateOutput, error)

	ContentCreatorList(in *ContentCreatorListInput) (*ContentCreatorListOutput, error)
	CurriculumGroupCaseUpdateContentCreator(in *CurriculumGroupCaseUpdateContentCreatorInput) error
	CurriculumGroupCaseUploadContentCreatorCsv(in *CurriculumGroupCaseUploadContentCreatorCsvInput) error
	CurriculumGroupCaseDownloadContentCreatorCsv(in *CurriculumGroupCaseDownloadContentCreatorCsvInput) (*CurriculumGroupCaseDownloadContentCreatorCsvOutput, error)

	SeedYearCaseBulkEdit(in *SeedYearCaseBulkEditInput) error
	SeedYearList(in *SeedYearListInput) (*SeedYearListOutput, error)
	SeedYearCreate(in *SeedYearCreateInput) (*SeedYearCreateOutput, error)
	SeedYearGet(in *SeedYearGetInput) (*SeedYearGetOutput, error)
	SeedYearUpdate(in *SeedYearUpdateInput) (*SeedYearUpdateOutput, error)
	SeedYearCaseDownloadCsv(in *SeedYearCaseDownloadCsvInput) (*SeedYearCaseDownloadCsvOutput, error)
	SeedYearCaseUploadCsv(in *SeedYearCaseUploadCsvInput) error

	SeedPlatformList() (*SeedPlatformListOutput, error)
	ContractCaseDownloadCsv(in *ContractCaseDownloadCsvInput) (*ContractCaseDownloadCsvOutput, error)

	PrefillSchool(in *PrefillSchoolInput) error
	ContractRefresh(in *ContractRefreshInput) error
}
