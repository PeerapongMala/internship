package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubLessonReportListRequest struct {
	constant.SubLessonReportFilter
}

// ==================== Response ==========================

type SubLessonReportListResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.SubLessonReportEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SubLessonReportListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subLessonReportListOutput, err := api.Service.SubLessonReportList(&SubLessonReportListInput{
		Pagination:                 pagination,
		SubLessonReportListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SubLessonReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subLessonReportListOutput.SubLessonReports,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonReportListInput struct {
	Pagination *helper.Pagination
	*SubLessonReportListRequest
}

type SubLessonReportListOutput struct {
	SubLessonReports []constant.SubLessonReportEntity
}

func (service *serviceStruct) SubLessonReportList(in *SubLessonReportListInput) (*SubLessonReportListOutput, error) {
	subLessonReports, err := service.adminReportStorage.SubLessonReportList(in.Pagination, &in.SubLessonReportFilter)
	if err != nil {
		return nil, err
	}

	return &SubLessonReportListOutput{
		SubLessonReports: subLessonReports,
	}, nil
}
