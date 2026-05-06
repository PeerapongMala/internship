package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudentLogLevelPlayClassListByStudentIdResponse struct {
	StatusCode int                    `json:"status_code"`
	Message    string                 `json:"message"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.ClassEntity `json:"data"`
}

func (api *APIStruct) StudentLogLevelPlayClassListByStudentId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	pagination := helper.PaginationNew(context)

	classes, err := api.Service.StudentLogLevelPlayClassListByStudentId(studentId, pagination)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentClassListByStudentIdResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Pagination: pagination,
		Data:       classes,
	})
}

func (service *serviceStruct) StudentLogLevelPlayClassListByStudentId(
	studentId string,
	pagination *helper.Pagination,
) ([]constant.ClassEntity, error) {
	return service.repositoryTeacherStudent.StudentLogLevelPlayClassListByStudentId(studentId, pagination)
}
