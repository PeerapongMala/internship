package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TeacherListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.TeacherEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	teacherFilter, err := helper.ParseAndValidateRequest(context, &constant.TeacherFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	teacherListOutput, err := api.Service.TeacherList(&TeacherListInput{
		Filter:     teacherFilter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       teacherListOutput.Teachers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherListInput struct {
	Filter     *constant.TeacherFilter
	Pagination *helper.Pagination
}

type TeacherListOutput struct {
	Teachers []constant.TeacherEntity
}

func (service *serviceStruct) TeacherList(in *TeacherListInput) (*TeacherListOutput, error) {
	teachers, err := service.adminSchoolStorage.TeacherList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &TeacherListOutput{
		Teachers: teachers,
	}, nil
}
