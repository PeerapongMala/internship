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

type LevelPlayLogCaseDownloadCsvRequest struct {
	constant.LevelPlayLogFilter
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelPlayLogCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelPlayLogCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	levelPlayLogCaseDownloadCsvOutput, err := api.Service.LevelPlayLogCaseDownloadCsv(&LevelPlayLogCaseDownloadCsvInput{
		ReportAccess:                       reportAccess,
		LevelPlayLogCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=level-play-log.csv")
	return context.Status(http.StatusOK).Send(levelPlayLogCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type LevelPlayLogCaseDownloadCsvInput struct {
	ReportAccess *constant2.ReportAccess
	*LevelPlayLogCaseDownloadCsvRequest
}

type LevelPlayLogCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) LevelPlayLogCaseDownloadCsv(in *LevelPlayLogCaseDownloadCsvInput) (*LevelPlayLogCaseDownloadCsvOutput, error) {
	levelPlayLogs, err := service.adminReportStorage.LevelPlayLogList(nil, &in.LevelPlayLogFilter)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.LevelPlayLogCsvHeader}
	for i, levelPlayLog := range levelPlayLogs {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			helper.HandleIntPointerField(levelPlayLog.PlayIndex),
			fmt.Sprintf(`%s/3`,
				helper.HandleIntPointerField(levelPlayLog.Score),
			),
			helper.HandleFloatPointerField(levelPlayLog.AverageTimeUsed),
			helper.HandleTimePointerToField(levelPlayLog.PlayedAt),
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &LevelPlayLogCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
