package service

type ServiceInterface interface {
	CurriculumGroupCaseListByContentCreator(in *CurriculumGroupCaseListByContentCreatorInput) (*CurriculumGroupCaseListByContentCreatorOutput, error)
	AuthCaseLoginWithEmailPassword(in *AuthCaseLoginWithEmailPasswordInput) (*AuthCaseLoginWithEmailPasswordOutput, error)
}
