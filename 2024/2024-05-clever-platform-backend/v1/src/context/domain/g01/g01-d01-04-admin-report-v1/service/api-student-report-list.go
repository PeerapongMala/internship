package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type StudentReportListRequest struct {
	constant.StudentReportFilter
}

// ==================== Response ==========================

type StudentReportListResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.StudentReportEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &StudentReportListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	studentReportListOutput, err := api.Service.StudentReportList(&StudentReportListInput{
		Pagination:               pagination,
		StudentReportListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&StudentReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentReportListOutput.StudentReports,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentReportListInput struct {
	Pagination *helper.Pagination
	*StudentReportListRequest
}

type StudentReportListOutput struct {
	StudentReports []constant.StudentReportEntity
}

func (service *serviceStruct) StudentReportList(in *StudentReportListInput) (*StudentReportListOutput, error) {
	classLessonIds, err := service.adminReportStorage.ClassLessonIdList(in.ClassId)
	if err != nil {
		return nil, err
	}

	in.StudentReportFilter.ClassLessonIds = classLessonIds
	studentReports, err := service.adminReportStorage.StudentReportList(in.Pagination, &in.StudentReportFilter)
	if err != nil {
		return nil, err
	}

	return &StudentReportListOutput{
		StudentReports: studentReports,
	}, nil
}
