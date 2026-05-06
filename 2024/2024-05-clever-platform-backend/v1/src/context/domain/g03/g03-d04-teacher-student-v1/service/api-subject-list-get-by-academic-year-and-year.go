package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type subjectListGetByAcademicYearYearResponse struct {
	Pagination helper.Pagination
	StatusCode int                      `json:"status_code"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

func (api APIStruct) SubjectListGetByAcademicYearAndYear(c *fiber.Ctx) error {
	teacherId, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(c, &constant.SubjectListGetByAcademicYearYearRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return err
	}

	pagination := helper.PaginationDropdown(c)

	subjectList, err := api.Service.SubjectListGetByAcademicYearAndYear(teacherId, *request, pagination)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	return c.Status(fiber.StatusOK).JSON(subjectListGetByAcademicYearYearResponse{
		Pagination: *pagination,
		StatusCode: fiber.StatusOK,
		Message:    "Success",
		Data:       subjectList,
	})
}

func (service serviceStruct) SubjectListGetByAcademicYearAndYear(teacherId string, request constant.SubjectListGetByAcademicYearYearRequest, pagination *helper.Pagination) ([]constant.SubjectEntity, error) {
	return service.repositoryTeacherStudent.SubjectListGetByAcademicYearAndYear(teacherId, request, pagination)
}
