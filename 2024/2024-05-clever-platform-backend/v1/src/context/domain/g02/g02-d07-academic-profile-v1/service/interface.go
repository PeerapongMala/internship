package service

type ServiceInterface interface {
	ContentCreatorGet(in *ContentCreatorGetInput) (*ContentCreatorGetOutput, error)
	ContentCreatorUpdate(in *ContentCreatorUpdateInput) (*ContentCreatorUpdateOutput, error)
	ContentCreatorCaseUpdatePassword(in *AuthCaseUpdatePasswordInput) error
}
