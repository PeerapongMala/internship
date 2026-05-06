package service

type ServiceInterface interface {
	PlatformCreate(in *PlatformCreateInput) (*PlatformCreateOutput, error)
	PlatformGet(in *PlatformGetInput) (*PlatformGetOutput, error)
	PlatformUpdate(in *PlatformUpdateInput) (*PlatformUpdateOutput, error)
	PlatformList(in *PlatformListInput) (*PlatformListOutput, error)
	SeedPlatformList(in *SeedPlatformListInput) (*SeedPlatformListOutput, error)
	PlatformCaseBulkEdit(in *PlatformCaseBulkEditInput) error

	YearCreate(in *YearCreateInput) (*YearCreateOutput, error)
	YearGet(in *YearGetInput) (*YearGetOutput, error)
	YearUpdate(in *YearUpdateInput) (*YearUpdateOutput, error)
	YearList(in *YearListInput) (*YearListOutput, error)
	YearCaseBulkEdit(in *YearCaseBulkEditInput) error
	YearUploadCSV(req *UploadYearCSVRequest) error
	YearDownloadCSV(req *DownloadYearCSVRequest) ([]byte, error)

	SubjectGroupCreate(in *SubjectGroupCreateInput) (*SubjectGroupCreateOutput, error)
	SubjectGroupGet(in *SubjectGroupGetInput) (*SubjectGroupGetOutput, error)
	SubjectGroupUpdate(in *SubjectGroupUpdateInput) (*SubjectGroupUpdateOutput, error)
	SubjectGroupList(in *SubjectGroupListInput) (*SubjectGroupListOutput, error)
	SubjectGroupCaseBulkEdit(in *SubjectGroupCaseBulkEditInput) error
	SubjectGroupUploadCSV(req *UploadSubjectGroupCSVRequest) error
	SubjectGroupDownloadCSV(req *DownloadSubjectGroupCSVRequest) ([]byte, error)

	SeedYearList(in *SeedYearListInput) (*SeedYearListOutput, error)
	SeedSubjectGroupList(in *SeedSubjectGroupListInput) (*SeedSubjectGroupListOutput, error)

	SubjectCreate(in *SubjectCreateInput) (*SubjectCreateOutput, error)
	SubjectGet(in *SubjectGetInput) (*SubjectGetOutput, error)
	SubjectUpdate(in *SubjectUpdateInput) (*SubjectUpdateOutput, error)
	SubjectList(in *SubjectListInput) (*SubjectListOutput, error)
	SubjectCaseBulkEdit(in *SubjectCaseBulkEditInput) error
	SubjectUploadCSV(req *UploadSubjectCSVRequest) error
	SubjectDownloadCSV(req *DownloadSubjectCSVRequest) ([]byte, error)

	TagCreate(in *TagCreateInput) (*TagCreateOutput, error)
	TagGet(in *TagGetInput) (*TagGetOutput, error)
	TagUpdate(in *TagUpdateInput) (*TagUpdateOutput, error)
	TagCaseListBySubjectId(in *TagCaseListBySubjectIdInput) (*TagCaseListBySubjectIdOutput, error)

	TagGroupUpdate(in *TagGroupUpdateInput) (*TagGroupUpdateOutput, error)

	SeedSubjectGroupCreate(in *SeedSubjectGroupCreateInput) error
	SeedSubjectGroupUpdate(in *SeedSubjectGroupUpdateInput) error
	SeedSubjectGroupGet(in *SeedSubjectGroupGetInput) (*SeedSubjectGroupGetOutput, error)
}
