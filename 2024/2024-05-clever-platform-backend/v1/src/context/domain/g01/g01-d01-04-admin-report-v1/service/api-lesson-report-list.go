package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonReportListRequest struct {
	constant.LessonReportFilter
}

// ==================== Response ==========================

type LessonReportListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"_pagination"`
	Data       []constant.LessonReportEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &LessonReportListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	lessonReportListOutput, err := api.Service.LessonReportList(&LessonReportListInput{
		Pagination:              pagination,
		LessonReportListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&LessonReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       lessonReportListOutput.LessonReports,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonReportListInput struct {
	Pagination *helper.Pagination
	*LessonReportListRequest
}

type LessonReportListOutput struct {
	LessonReports []constant.LessonReportEntity
}

func (service *serviceStruct) LessonReportList(in *LessonReportListInput) (*LessonReportListOutput, error) {
	classLessonIds, err := service.adminReportStorage.ClassLessonIdList(in.ClassId)
	if err != nil {
		return nil, err
	}

	in.LessonReportFilter.ClassLessonIds = classLessonIds
	lessonReports, err := service.adminReportStorage.LessonReportList(in.Pagination, &in.LessonReportFilter)
	if err != nil {
		return nil, err
	}

	return &LessonReportListOutput{
		LessonReports: lessonReports,
	}, nil
}
