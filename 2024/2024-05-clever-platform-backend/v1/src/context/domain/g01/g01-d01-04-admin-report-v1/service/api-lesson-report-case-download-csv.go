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

type LessonReportCaseDownloadCsvRequest struct {
	constant.LessonReportFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonReportCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	seedYearCaseDownloadCsvOutput, err := api.Service.LessonReportCaseDownloadCsv(&LessonReportCaseDownloadCsvInput{
		ReportAccess:                       reportAccess,
		LessonReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=lesson-report.csv")
	return context.Status(http.StatusOK).Send(seedYearCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type LessonReportCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*LessonReportCaseDownloadCsvRequest
}

type LessonReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) LessonReportCaseDownloadCsv(in *LessonReportCaseDownloadCsvInput) (*LessonReportCaseDownloadCsvOutput, error) {
	classLessonIds, err := service.adminReportStorage.ClassLessonIdList(in.ClassId)
	if err != nil {
		return nil, err
	}

	in.LessonReportFilter.ClassLessonIds = classLessonIds
	lessonReports, err := service.adminReportStorage.LessonReportList(nil, &in.LessonReportFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.LessonReportCsvHeader}
	for i, lessonReport := range lessonReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleStringPointerField(lessonReport.CurriculumGroupShortName),
			helper.HandleStringPointerField(lessonReport.Subject),
			helper.HandleStringPointerField(lessonReport.LessonName),
			fmt.Sprintf(`%s/%s`,
				helper.HandleFloatPointerField(lessonReport.PassedLevelCount),
				helper.HandleIntPointerField(lessonReport.TotalLevelsCount),
			),
			fmt.Sprintf(`%s/%s`,
				helper.HandleIntPointerField(lessonReport.Score),
				helper.HandleFloatPointerField(lessonReport.TotalScore),
			),
			helper.HandleIntPointerField(lessonReport.PlayCount),
			helper.HandleFloatPointerField(lessonReport.AverageTimeUsed),
			helper.HandleTimePointerToField(lessonReport.LastLogin),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &LessonReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
