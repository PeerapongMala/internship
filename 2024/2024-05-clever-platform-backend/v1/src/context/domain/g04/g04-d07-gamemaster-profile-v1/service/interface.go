package service

type ServiceInterface interface {
	GamemasterGet(in *GamemasterGetInput) (*GamemasterGetOutput, error)
	GamemasterUpdate(in *GamemasterUpdateInput) (*GamemastterUpdateOutput, error)
	GamemasterCaseUpdatePassword(in *GamemasterCaseUpdatePasswordInput) error
}
