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

type SubLessonReportCaseDownloadCsvRequest struct {
	constant.SubLessonReportFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonReportCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subLessonCaseDownloadCsvOutput, err := api.Service.SubLessonReportCaseDownloadCsv(&SubLessonReportCaseDownloadCsvInput{
		ReportAccess:                          reportAccess,
		SubLessonReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=sub-lesson-report.csv")
	return context.Status(http.StatusOK).Send(subLessonCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type SubLessonReportCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*SubLessonReportCaseDownloadCsvRequest
}

type SubLessonReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) SubLessonReportCaseDownloadCsv(in *SubLessonReportCaseDownloadCsvInput) (*SubLessonReportCaseDownloadCsvOutput, error) {
	subLessonReports, err := service.adminReportStorage.SubLessonReportList(nil, &in.SubLessonReportFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.SubLessonReportCsvHeader}
	for i, subLessonReport := range subLessonReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			fmt.Sprintf(`บทที่ %s-%s %s`, helper.HandleIntPointerField(subLessonReport.LessonIndex), helper.HandleIntPointerField(subLessonReport.SubLessonIndex), helper.HandleStringPointerField(subLessonReport.SubLessonName)),
			fmt.Sprintf(`%s/%s`,
				helper.HandleIntPointerField(subLessonReport.PassedLevelCount),
				helper.HandleIntPointerField(subLessonReport.TotalLevelCount),
			),
			fmt.Sprintf(`%s/%s`,
				helper.HandleIntPointerField(subLessonReport.Score),
				helper.HandleIntPointerField(subLessonReport.TotalScore),
			),
			helper.HandleIntPointerField(subLessonReport.PlayCount),
			fmt.Sprintf(`%s`, helper.HandleFloatPointerField(subLessonReport.AverageTimeUsed)),
			helper.HandleTimePointerToField(subLessonReport.LastPlayed),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &SubLessonReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
