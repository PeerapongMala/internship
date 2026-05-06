package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SchoolTeacherListRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
	constant.SchoolTeacherFilter
}

// ==================== Response ==========================

type SchoolTeacherListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.TeacherEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolTeacherList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolTeacherListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	schoolTeacherListOutput, err := api.Service.SchoolTeacherList(&SchoolTeacherListInput{
		Pagination:               pagination,
		SchoolTeacherListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolTeacherListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolTeacherListOutput.Teachers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolTeacherListInput struct {
	Pagination *helper.Pagination
	*SchoolTeacherListRequest
}

type SchoolTeacherListOutput struct {
	Teachers []constant.TeacherEntity
}

func (service *serviceStruct) SchoolTeacherList(in *SchoolTeacherListInput) (*SchoolTeacherListOutput, error) {
	teachers, err := service.subjectTeacherStorage.SchoolTeacherList(in.SchoolId, &in.SchoolTeacherFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolTeacherListOutput{teachers}, nil
}
