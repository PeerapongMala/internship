package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LevelPlayLogListRequest struct {
	constant.LevelPlayLogFilter
}

// ==================== Response ==========================

type LevelPlayLogListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"_pagination"`
	Data       []constant.LevelPlayLogEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelPlayLogList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &LevelPlayLogListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	levelPlayLogListOutput, err := api.Service.LevelPlayLogList(&LevelPlayLogListInput{
		Pagination:              pagination,
		LevelPlayLogListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&LevelPlayLogListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelPlayLogListOutput.LevelPlayLogs,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelPlayLogListInput struct {
	Pagination *helper.Pagination
	*LevelPlayLogListRequest
}

type LevelPlayLogListOutput struct {
	LevelPlayLogs []constant.LevelPlayLogEntity
}

func (service *serviceStruct) LevelPlayLogList(in *LevelPlayLogListInput) (*LevelPlayLogListOutput, error) {
	levelPlayLogs, err := service.adminReportStorage.LevelPlayLogList(in.Pagination, &in.LevelPlayLogFilter)
	if err != nil {
		return nil, err
	}

	return &LevelPlayLogListOutput{
		LevelPlayLogs: levelPlayLogs,
	}, nil
}
