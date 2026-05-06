package service

type ServiceInterface interface {
	TeacherGet(in *TeacherGetInput) (*TeacherGetOutput, error)
	TeacherCaseUpdatePassword(in *TeacherCaseUpdatePasswordInput) error
	TeacherUpdate(in *TeacherUpdateInput) (*TeacherUpdateOutput, error)
	UserCaseDeleteOauth(in *UserCaseDeleteOauthInput) error
}
