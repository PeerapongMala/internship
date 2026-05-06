package service

import (
	"fmt"
	"net/http"
	"strconv"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassReportCaseDownloadCsvRequest struct {
	constant.ClassReportFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassReportCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	seedYearCaseDownloadCsvOutput, err := api.Service.ClassReportCaseDownloadCsv(&ClassReportCaseDownloadCsvInput{
		ReportAccess:                      reportAccess,
		ClassReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=class-report.csv")
	return context.Status(http.StatusOK).Send(seedYearCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type ClassReportCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*ClassReportCaseDownloadCsvRequest
}

type ClassReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) ClassReportCaseDownloadCsv(in *ClassReportCaseDownloadCsvInput) (*ClassReportCaseDownloadCsvOutput, error) {
	schoolReports, err := service.adminReportStorage.ClassReportList(nil, &in.ClassReportFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.ClassReportCsvHeader}
	for i, schoolReport := range schoolReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleIntDefaultPointerField(schoolReport.AcademicYear),
			helper.HandleStringPointerField(schoolReport.ClassYear),
			helper.HandleStringPointerField(schoolReport.ClassName),
			helper.HandleIntDefaultPointerField(schoolReport.StudentCount),
			helper.HandleIntDefaultPointerField(schoolReport.ActiveStudentCount),
			helper.HandleFloatPointerField(schoolReport.AveragePassedLevels),
			helper.HandleFloatPointerField(schoolReport.AverageTotalScore),
			fmt.Sprintf("%f", helper.SafeDivide(helper.Deref(schoolReport.AveragePassedLevels)*3, float64(helper.Deref(schoolReport.StudentCount)))),
			helper.HandleIntDefaultPointerField(schoolReport.PlayCount),
			helper.HandleFloatPointerField(schoolReport.AverageTimeUsed),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &ClassReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
