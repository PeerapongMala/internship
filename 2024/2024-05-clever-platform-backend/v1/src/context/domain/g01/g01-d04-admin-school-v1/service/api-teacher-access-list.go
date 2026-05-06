package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TeacherAccessListResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.TeacherAccessEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherAccessList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	teacherAccessListOutput, err := api.Service.TeacherAccessList(&TeacherAccessListInput{
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherAccessListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       teacherAccessListOutput.TeacherAccesses,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherAccessListInput struct {
	Pagination *helper.Pagination
}

type TeacherAccessListOutput struct {
	TeacherAccesses []constant.TeacherAccessEntity
}

func (service *serviceStruct) TeacherAccessList(in *TeacherAccessListInput) (*TeacherAccessListOutput, error) {
	teacherAccesses, err := service.adminSchoolStorage.TeacherAccessList(in.Pagination)
	if err != nil {
		return nil, err
	}

	return &TeacherAccessListOutput{TeacherAccesses: teacherAccesses}, nil
}
