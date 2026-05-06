package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LessonListGetBySubjectIdResponse struct {
	helper.PaginationResponse
	StatusCode int                             `json:"status_code"`
	Message    string                          `json:"message"`
	Data       []constant.TeacherStudentFilter `json:"data"`
}

func (api *APIStruct) LessonListGetBySubjectId(context *fiber.Ctx) error {
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	pagination := helper.PaginationDropdown(context)

	data, err := api.Service.LessonListGetBySubjectId(subjectId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(LessonListGetBySubjectIdResponse{
		PaginationResponse: helper.NewPaginationResponse(pagination),
		StatusCode:         http.StatusOK,
		Message:            "Success",
		Data:               data,
	})
}

func (service *serviceStruct) LessonListGetBySubjectId(subjectId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error) {
	return service.repositoryTeacherStudent.LessonListBySubjectId(subjectId, pagination)
}
