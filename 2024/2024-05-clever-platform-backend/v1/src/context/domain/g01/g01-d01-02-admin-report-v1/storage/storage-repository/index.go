package storageRepository

import (
	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"time"
)

type Repository interface {
	InspectionAreaProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess) ([]constant.ProgressReport, error)
	AreaOfficeProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess, parentScope string) ([]constant.ProgressReport, error)
	SchoolProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error)
	YearProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error)
	DistrictZoneProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess) ([]constant.ProgressReport, error)
	DistrictProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error)
	DoeSchoolProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error)
	ProvinceProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess) ([]constant.ProgressReport, error)
	LaoDistrictProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error)
	LaoSchoolProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error)
	OpecEtcSchoolProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess, schoolAffiliationGroup string) ([]constant.ProgressReport, error)
}
