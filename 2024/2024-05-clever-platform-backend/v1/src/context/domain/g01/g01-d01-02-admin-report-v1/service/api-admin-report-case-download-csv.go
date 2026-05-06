package service

import (
	"net/http"
	"strconv"
	"time"

	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AdminReportCaseDownloadCsvRequest struct {
	ParentScope string     `query:"parent_scope"`
	Scope       string     `query:"scope" validate:"required"`
	StartDate   *time.Time `query:"start_date" validate:"required"`
	EndDate     *time.Time `query:"end_date" validate:"required"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) AdminReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AdminReportCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*observerConstant.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	adminReportCaseDownloadCsvOutput, err := api.Service.AdminReportCaseDownloadCsv(&AdminReportCaseDownloadCsvInput{
		ReportAccess:                      reportAccess,
		SubjectId:                         &subjectId,
		AdminReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=admin-report.csv")
	return context.Status(http.StatusOK).Send(adminReportCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type AdminReportCaseDownloadCsvInput struct {
	ReportAccess *observerConstant.ReportAccess
	SubjectId    *string
	*AdminReportCaseDownloadCsvRequest
}

type AdminReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) AdminReportCaseDownloadCsv(in *AdminReportCaseDownloadCsvInput) (*AdminReportCaseDownloadCsvOutput, error) {
	err := service.ValidateReportScope(&ValidateReportScopeInput{
		Scope:       in.Scope,
		ParentScope: in.ParentScope,
	})
	if err != nil {
		return nil, err
	}

	averageProgress := 3.14
	adminReport := constant.AdminReport{
		AverageProgress: &averageProgress,
		StartDate:       in.StartDate,
		EndDate:         in.EndDate,
	}

	csvHeader := []string{}
	switch in.Scope {
	case constant.InspectionArea:
		progressReports, err := service.adminReportStorage.InspectionAreaProgressList(nil, in.StartDate, in.EndDate, in.ReportAccess)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.InspectionAreaCsvHeader
	case constant.AreaOffice:
		progressReports, err := service.adminReportStorage.AreaOfficeProgressList(nil, in.StartDate, in.EndDate, in.ReportAccess, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.AreaOfficeCsvHeader
	case constant.DistrictZone:
		progressReports, err := service.adminReportStorage.DistrictZoneProgressList(nil, in.StartDate, in.EndDate, in.ReportAccess)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.DistrictZoneCsvHeader
	case constant.District:
		progressReports, err := service.adminReportStorage.DistrictProgressList(nil, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.DistrictCsvHeader
	case constant.Province:
		progressReports, err := service.adminReportStorage.ProvinceProgressList(nil, in.StartDate, in.EndDate, in.ReportAccess)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.ProvinceCsvHeader
	case constant.LaoDistrict:
		progressReports, err := service.adminReportStorage.LaoDistrictProgressList(nil, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.LaoDistrictCsvHeader
	case constant.LaoSchool:
		progressReports, err := service.adminReportStorage.LaoSchoolProgressList(nil, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.SchoolCsvHeader
	case constant.School:
		progressReports, err := service.adminReportStorage.SchoolProgressList(nil, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.SchoolCsvHeader
	case constant.OpecSchool:
		progressReports, err := service.adminReportStorage.OpecEtcSchoolProgressList(nil, in.StartDate, in.EndDate, in.ReportAccess, "สช")
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.SchoolCsvHeader
	case constant.DoeSchool:
		progressReports, err := service.adminReportStorage.DoeSchoolProgressList(nil, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.SchoolCsvHeader
	case constant.EtcSchool:
		progressReports, err := service.adminReportStorage.OpecEtcSchoolProgressList(nil, in.StartDate, in.EndDate, in.ReportAccess, "อื่นๆ")
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.SchoolCsvHeader
	case constant.Year:
		progressReports, err := service.adminReportStorage.YearProgressList(nil, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
		adminReport.ProgressReports = progressReports
		csvHeader = constant.YearCsvHeader
	}

	csvData := [][]string{csvHeader}
	for i, report := range adminReport.ProgressReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			report.Scope,
			helper.HandleFloatPointerField(&report.Progress),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &AdminReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
