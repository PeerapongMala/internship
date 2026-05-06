package service

type ServiceInterface interface {
	AuthCaseGetOAuthProfile(in *AuthCaseGetOAuthProfileInput) (*AuthCaseGetOAuthProfileOutput, error)
	AuthCaseExchangeCodeForToken(in *AuthCaseExchangeCodeForTokenInput) (*AuthCaseExchangeCodeForTokenOutput, error)
	AuthCaseFindOAuthProfile(in *AuthCaseFindOAuthProfileInput) (*AuthCaseFindOAuthProfileOutput, error)
	AuthCaseLoginWithOAuth(in *AuthCaseLoginWithOAuthInput) (*AuthCaseLoginWithOAuthOutput, error)
	AuthCaseBindStudentWithOAuth(in *AuthCaseBindStudentWithOAuthInput) error
	AuthCaseLoginWithPin(in *AuthCaseLoginWithPinInput) (*AuthCaseLoginWithPinOutput, error)
	ObserverAccessCreate(in *ObserverAccessCreateInput) (*ObserverAccessCreateOutput, error)
	ObserverAccessList(in *ObserverAccessListInput) (*ObserverAccessListOutput, error)
	AuthCaseUnbindOAuth(in *AuthCaseUnbindOAuthInput) error
	AuthCaseUpdatePassword(in *AuthCaseUpdatePasswordInput) error
	AuthCaseUpdatePin(in *AuthCaseUpdatePinInput) error
}
