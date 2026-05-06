package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strconv"
)

// ==================== Request ==========================

type SchoolReportCaseDownloadCsvRequest struct {
	constant.SchoolReportFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolReportCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	seedYearCaseDownloadCsvOutput, err := api.Service.SchoolReportCaseDownloadCsv(&SchoolReportCaseDownloadCsvInput{
		ReportAccess:                       reportAccess,
		SchoolReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=school-report.csv")
	return context.Status(http.StatusOK).Send(seedYearCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type SchoolReportCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*SchoolReportCaseDownloadCsvRequest
}

type SchoolReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) SchoolReportCaseDownloadCsv(in *SchoolReportCaseDownloadCsvInput) (*SchoolReportCaseDownloadCsvOutput, error) {
	schoolReports, err := service.adminReportStorage.SchoolReportList(in.ReportAccess.SchoolIds, nil, &in.SchoolReportFilter, in.ReportAccess.CanAccessAll)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.SchoolReportCsvHeader}
	for i, schoolReport := range schoolReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleIntDefaultPointerField(schoolReport.SchoolId),
			helper.HandleStringPointerField(schoolReport.SchoolCode),
			helper.HandleStringPointerField(schoolReport.SchoolName),
			helper.HandleIntDefaultPointerField(schoolReport.ClassCount),
			helper.HandleIntDefaultPointerField(schoolReport.StudentCount),
			helper.HandleFloatPointerField(schoolReport.AveragePassedLevels),
			helper.HandleFloatPointerField(schoolReport.AverageTotalScore),
			helper.HandleIntDefaultPointerField(schoolReport.PlayCount),
			helper.HandleFloatPointerField(schoolReport.AverageTimeUsed),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &SchoolReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
