package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type subjectListGetByTeacherIdResponse struct {
	Pagination helper.Pagination                         `json:"_pagination"`
	StatusCode int                                       `json:"status_code"`
	Message    string                                    `json:"message"`
	Data       []constant.SubjectListByTeacherIdResponse `json:"data"`
}

func (api APIStruct) SubjectListGetByTeacherGroupId(c *fiber.Ctx) error {
	teacherID, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(c)

	data, err := api.Service.SubjectListGetByTeacherId(teacherID, pagination)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(subjectListGetByTeacherIdResponse{
		Pagination: *pagination,
		StatusCode: fiber.StatusOK,
		Message:    "Success",
		Data:       data,
	})
}

func (service serviceStruct) SubjectListGetByTeacherId(teacherId string, pagination *helper.Pagination) ([]constant.SubjectListByTeacherIdResponse, error) {
	return service.repositoryTeacherStudent.SubjectListByTeacherId(teacherId, pagination)
}
