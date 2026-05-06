package service

type ServiceInterface interface {
	HelperCaseReInitializeDatabase() error
	HelperCaseIncrementModelVersionId() error
	HelperCaseHealthCheck() (*HelperCaseHealthCheckOutput, error)
}
