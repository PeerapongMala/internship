package service

type ServiceInterface interface {
	TosCaseAccept(in *TosCaseAcceptInput) error
	TosCaseCheckAcceptance(in *TosCaseCheckAcceptanceInput) (*TosCaseCheckAcceptanceOutput, error)
	TosGet(in *TosGetInput) (*TosGetOutput, error)
}
