package service

import (
	"fmt"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strconv"
)

// ==================== Request ==========================

type StudentReportCaseDownloadCsvRequest struct {
	constant.StudentReportFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentReportCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))

	}

	studentReportCaseDownloadCsvOutput, err := api.Service.StudentReportCaseDownloadCsv(&StudentReportCaseDownloadCsvInput{
		ReportAccess:                        reportAccess,
		StudentReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=student-report.csv")
	return context.Status(http.StatusOK).Send(studentReportCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type StudentReportCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*StudentReportCaseDownloadCsvRequest
}

type StudentReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) StudentReportCaseDownloadCsv(in *StudentReportCaseDownloadCsvInput) (*StudentReportCaseDownloadCsvOutput, error) {
	classLessonIds, err := service.adminReportStorage.ClassLessonIdList(in.ClassId)
	if err != nil {
		return nil, err
	}

	in.StudentReportFilter.ClassLessonIds = classLessonIds
	studentReports, err := service.adminReportStorage.StudentReportList(nil, &in.StudentReportFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.StudentReportCsvHeader}
	for i, studentReport := range studentReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleStringPointerField(studentReport.StudentId),
			helper.HandleStringPointerField(studentReport.Title),
			helper.HandleStringPointerField(studentReport.FirstName),
			helper.HandleStringPointerField(studentReport.LastName),
			fmt.Sprintf(`%s/%s`,
				helper.HandleFloatPointerField(studentReport.PassedLevelCount),
				helper.HandleIntPointerField(studentReport.TotalLevelsCount),
			),
			fmt.Sprintf(`%s/%s`,
				helper.HandleIntPointerField(studentReport.Score),
				helper.HandleFloatPointerField(studentReport.TotalScore),
			),
			helper.HandleIntPointerField(studentReport.PlayCount),
			helper.HandleFloatPointerField(studentReport.AverageTimeUsed),
			helper.HandleTimePointerToField(studentReport.LastLogin),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &StudentReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
