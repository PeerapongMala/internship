package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LevelReportListRequest struct {
	constant.LevelReportFilter
}

// ==================== Response ==========================

type LevelReportListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.LevelReportEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &LevelReportListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	levelReportListOutput, err := api.Service.LevelReportList(&LevelReportListInput{
		Pagination:             pagination,
		LevelReportListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&LevelReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelReportListOutput.LevelReports,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelReportListInput struct {
	Pagination *helper.Pagination
	*LevelReportListRequest
}

type LevelReportListOutput struct {
	LevelReports []constant.LevelReportEntity
}

func (service *serviceStruct) LevelReportList(in *LevelReportListInput) (*LevelReportListOutput, error) {
	levelReports, err := service.adminReportStorage.LevelReportList(in.Pagination, &in.LevelReportFilter)
	if err != nil {
		return nil, err
	}

	return &LevelReportListOutput{
		LevelReports: levelReports,
	}, nil
}
