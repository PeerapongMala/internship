package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type StudentListGetResponse struct {
	StatusCode int                      `json:"status_code"`
	Message    string                   `json:"message"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.StudentEntity `json:"data"`
}

func (api *APIStruct) StudentListByTeacherId(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)

	filter := constant.StudentListByTeacherIdFilter{}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.StudentListByTeacherId(teacherId, pagination, filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentListGetResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Pagination: pagination,
		Data:       data,
	})
}

func (service *serviceStruct) StudentListByTeacherId(
	teacherId string,
	pagination *helper.Pagination,
	filter constant.StudentListByTeacherIdFilter,
) ([]constant.StudentEntity, error) {
	studentInfoList, err := service.repositoryTeacherStudent.StudentListByTeacherId(teacherId, pagination, filter)
	if err != nil {
		return nil, err
	}

	return studentInfoList, nil
}
