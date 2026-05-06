package service

type ServiceInterface interface {
	LevelRewardList(in *LevelRewardListInput) (*LevelRewardListOutput, error)
	SeedSubjectGroupList(in *SeedSubjectGroupListInput) (*SeedSubjectGroupListOutput, error)
	LevelList(in *LevelListInput) (*LevelListOutput, error)
	SubjectList(in *SubjectListInput) (*SubjectListOutput, error)
	LessonList(in *LessonListInput) (*LessonListOutput, error)
	SubLessonList(in *SubLessonListInput) (*SubLessonListOutput, error)
	ItemList(in *ItemListInput) (*ItemListOutput, error)
	LevelSpecialRewardCaseBulkEdit(in *LevelSpecialRewardCaseBulkEditInput) error
	LevelSpecialRewardItemList(in *LevelSpecialRewardItemListInput) (*LevelSpecialRewardItemListOutput, error)
	LevelSpecialRewardItemCaseBulkEdit(in *LevelSpecialRewardItemCaseBulkEditInput) error
	LevelSpecialRewardItemUpdate(in *LevelSpecialRewardItemUpdateInput) error
	LevelDataGet(in *LevelDataGetInput) (*LevelDataGetOutput, error)

	// service
	CheckLevelStatus(in *CheckLevelStatusInput) error
}
