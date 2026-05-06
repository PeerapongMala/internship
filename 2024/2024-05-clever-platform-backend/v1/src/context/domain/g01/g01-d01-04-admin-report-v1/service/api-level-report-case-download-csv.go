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

type LevelReportCaseDownloadCsvRequest struct {
	constant.LevelReportFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelReportCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelReportCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	levelReportCaseDownloadCsvOutput, err := api.Service.LevelReportCaseDownloadCsv(&LevelReportCaseDownloadCsvInput{
		ReportAccess:                      reportAccess,
		LevelReportCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=level-report.csv")
	return context.Status(http.StatusOK).Send(levelReportCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type LevelReportCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*LevelReportCaseDownloadCsvRequest
}

type LevelReportCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) LevelReportCaseDownloadCsv(in *LevelReportCaseDownloadCsvInput) (*LevelReportCaseDownloadCsvOutput, error) {
	levelReports, err := service.adminReportStorage.LevelReportList(nil, &in.LevelReportFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.LevelReportCsvHeader}
	for i, levelReport := range levelReports {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleIntPointerField(levelReport.LevelIndex),
			constant.LevelTypeMap[helper.HandleStringPointerField(levelReport.LevelType)],
			helper.HandleStringPointerField(levelReport.QuestionType),
			constant.LevelDifficultyMap[helper.HandleStringPointerField(levelReport.Difficulty)],
			fmt.Sprintf(`%s/%s`,
				helper.HandleIntPointerField(levelReport.Score),
				helper.HandleIntPointerField(levelReport.TotalScore),
			),
			helper.HandleIntPointerField(levelReport.PlayCount),
			helper.HandleFloatPointerField(levelReport.AverageTimeUsed),
			helper.HandleTimePointerToField(levelReport.LastPlayed),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &LevelReportCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
