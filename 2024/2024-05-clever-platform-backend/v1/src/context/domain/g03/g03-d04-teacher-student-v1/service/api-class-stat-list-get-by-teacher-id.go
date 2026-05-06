package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type ClassStatListGetByTeacherId struct {
	StatusCode int                                      `json:"status_code"`
	Message    string                                   `json:"message"`
	Pagination *helper.Pagination                       `json:"_pagination"`
	Data       []constant.TeacherStudentWithStateEntity `json:"data"`
}

func (api *APIStruct) ClassStatListGetByTeacherId(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	filter := constant.TeacherStudentListWithStatFilter{}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)
	data, err := api.Service.ClassStatListGetByTeacherId(teacherId, filter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassStatListGetByTeacherId{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Pagination: pagination,
		Data:       data,
	})
}

func (service *serviceStruct) ClassStatListGetByTeacherId(
	teacherId string,
	filter constant.TeacherStudentListWithStatFilter,
	pagination *helper.Pagination,
) ([]constant.TeacherStudentWithStateEntity, error) {
	return service.repositoryTeacherStudent.TeacherStudentListWithStatByTeacherId(teacherId, filter, pagination)
}
