package service

type ServiceInterface interface {
	AuthCaseLoginWithPin(in *AuthCaseLoginWithPinInput) (*AuthCaseLoginWithPinOutput, error)
	AuthCaseLoginWithOauth(in *AuthCaseLoginWithOauthInput) (*AuthCaseLoginWithOauthOutput, error)
	AuthCaseUserLoginWithOauth(in *AuthCaseUserLoginWithOauthInput) (*AuthCaseUserLoginWithOauthOutput, error)
	AuthCaseGetOauthProfile(in *AuthCaseGetOauthProfileInput) (*AuthCaseGetOauthProfileOutput, error)
	AuthCaseBindWithOauth(in *AuthCaseBindWithOauthInput) error
	AuthCaseBindUserWithOauth(in *AuthCaseBindUserWithOauthInput) error
	SchoolCaseCheckExistence(in *SchoolCaseCheckExistenceInput) (*SchoolCaseCheckExistenceOutput, error)
	AuthCaseAdminLoginAs(in *AuthCaseAdminLoginAsInput) (*AuthCaseAdminLoginAsOutput, error)
	StudentGet(in *StudentGetInput) (*StudentGetOutput, error)
	ParentCaseRegister(in *ParentCaseRegisterInput) error
	AssetPreSignedUrlList() (*AssetPreSignedUrlListOutput, error)
	AssetZipPreSignedUrlList() (*AssetPreSignedUrlListOutput, error)
	AuthCaseCheckAdmin(in *AuthCaseCheckAdminInput) (*AuthCaseCheckAdminOutput, error)

	// service
	GetOauthProfile(in *GetOauthProfileInput) (*GetOauthProfileOutput, error)
	ExchangeCodeForToken(in *ExchangeCodeForTokenInput) (*ExchangeCodeForTokenOutput, error)
}
