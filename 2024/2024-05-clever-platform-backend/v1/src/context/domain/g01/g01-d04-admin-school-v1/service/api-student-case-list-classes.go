package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListClassesResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.ClassEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListClasses(context *fiber.Ctx) error {
	userId := context.Params("userId")
	pagination := helper.PaginationNew(context)

	StudentCaseListClassesOutput, err := api.Service.StudentCaseListClasses(&StudentCaseListClassesInput{
		UserId:     userId,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListClassesResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       StudentCaseListClassesOutput.Classes,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListClassesInput struct {
	UserId     string
	Pagination *helper.Pagination
}

type StudentCaseListClassesOutput struct {
	Classes []constant.ClassEntity
}

func (service *serviceStruct) StudentCaseListClasses(in *StudentCaseListClassesInput) (*StudentCaseListClassesOutput, error) {
	classes, err := service.adminSchoolStorage.StudentCaseListClasses(in.UserId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListClassesOutput{
		Classes: classes,
	}, nil
}
