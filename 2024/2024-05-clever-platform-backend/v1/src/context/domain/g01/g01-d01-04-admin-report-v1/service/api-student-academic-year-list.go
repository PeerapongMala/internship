package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type StudentAcademicYearListRequest struct {
	UserId string `params:"userId" validate:"required"`
}

// ==================== Response ==========================

type StudentAcademicYearListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       []int              `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentAcademicYearList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &StudentAcademicYearListRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	studentAcademicYearListOutput, err := api.Service.StudentAcademicYearList(&StudentAcademicYearListInput{
		Pagination:                     pagination,
		StudentAcademicYearListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&StudentAcademicYearListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentAcademicYearListOutput.AcademicYears,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentAcademicYearListInput struct {
	Pagination *helper.Pagination
	*StudentAcademicYearListRequest
}

type StudentAcademicYearListOutput struct {
	AcademicYears []int
}

func (service *serviceStruct) StudentAcademicYearList(in *StudentAcademicYearListInput) (*StudentAcademicYearListOutput, error) {
	academicYears, err := service.adminReportStorage.StudentAcademicYearList(in.Pagination, in.UserId)
	if err != nil {
		return nil, err
	}

	return &StudentAcademicYearListOutput{
		academicYears,
	}, nil
}
