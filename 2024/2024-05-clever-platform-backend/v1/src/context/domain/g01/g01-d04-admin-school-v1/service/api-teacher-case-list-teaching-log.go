package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type TeacherCaseListTeachingLogResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.TeachingLogEntity `json:"data"`
	Message    string                       `json:"message"`
}

func (api *APIStruct) TeacherCaseListTeachingLog(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	teacherId := context.Params("teacherId")

	teacherCaseListTeachingLogOutput, err := api.Service.TeacherCaseListTeachingLog(&TeacherCaseListTeachingLogInput{
		TeacherId:  teacherId,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCaseListTeachingLogResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       teacherCaseListTeachingLogOutput.TeachingLogs,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherCaseListTeachingLogInput struct {
	TeacherId  string
	Pagination *helper.Pagination
}

type TeacherCaseListTeachingLogOutput struct {
	TeachingLogs []constant.TeachingLogEntity
}

func (service *serviceStruct) TeacherCaseListTeachingLog(in *TeacherCaseListTeachingLogInput) (*TeacherCaseListTeachingLogOutput, error) {
	teachingLogs, err := service.adminSchoolStorage.TeacherCaseListTeachingLog(in.TeacherId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &TeacherCaseListTeachingLogOutput{
		TeachingLogs: teachingLogs,
	}, nil
}
