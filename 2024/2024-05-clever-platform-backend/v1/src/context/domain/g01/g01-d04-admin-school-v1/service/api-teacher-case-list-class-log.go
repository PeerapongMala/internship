package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TeacherCaseListClassLogResponse struct {
	StatusCode int                       `json:"status_code"`
	Pagination *helper.Pagination        `json:"_pagination"`
	Data       []constant.ClassLogEntity `json:"data"`
	Message    string                    `json:"message"`
}

func (api *APIStruct) TeacherCaseListClassLog(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	teacherId := context.Params("teacherId")

	teacherCaseListClassLogOutput, err := api.Service.TeacherCaseListClassLog(&TeacherCaseListClassLogInput{
		TeacherId:  teacherId,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCaseListClassLogResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       teacherCaseListClassLogOutput.ClassLogs,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherCaseListClassLogInput struct {
	TeacherId  string
	Pagination *helper.Pagination
}

type TeacherCaseListClassLogOutput struct {
	ClassLogs []constant.ClassLogEntity
}

func (service *serviceStruct) TeacherCaseListClassLog(in *TeacherCaseListClassLogInput) (*TeacherCaseListClassLogOutput, error) {
	classLogs, err := service.adminSchoolStorage.TeacherCaseListClassLog(in.TeacherId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &TeacherCaseListClassLogOutput{ClassLogs: classLogs}, nil
}
