package service

type ServiceInterface interface {
	AdminReportList(in *AdminReportListInput) (*AdminReportListOutput, error)
	AdminReportCaseDownloadCsv(in *AdminReportCaseDownloadCsvInput) (*AdminReportCaseDownloadCsvOutput, error)
	ValidateReportScope(in *ValidateReportScopeInput) error
}
