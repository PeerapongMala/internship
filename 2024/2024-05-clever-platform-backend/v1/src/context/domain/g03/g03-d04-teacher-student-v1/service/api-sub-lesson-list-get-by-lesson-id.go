package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type SubLessonListGetByLessonIdResponse struct {
	StatusCode int                             `json:"status_code"`
	Message    string                          `json:"message"`
	Data       []constant.TeacherStudentFilter `json:"data"`
}

func (api *APIStruct) SubLessonListGetByLessonId(context *fiber.Ctx) error {
	lessonId, err := context.ParamsInt("lessonId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.SubLessonListGetByLessonId(lessonId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(SubLessonListGetByLessonIdResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) SubLessonListGetByLessonId(lessonId int) ([]constant.TeacherStudentFilter, error) {
	return service.repositoryTeacherStudent.SubLessonListByLessonId(lessonId)
}
