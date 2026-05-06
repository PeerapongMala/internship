package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type TeacherAcademicYearListGetResponse struct {
	helper.PaginationResponse
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	Data       []int  `json:"data"`
}

func (api *APIStruct) TeacherAcademicYearListGet(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationDropdown(context)

	academicYears, err := api.Service.TeacherAcademicYearListGet(teacherId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(TeacherAcademicYearListGetResponse{
		PaginationResponse: helper.NewPaginationResponse(pagination),
		StatusCode:         http.StatusOK,
		Message:            "Success",
		Data:               academicYears,
	})
}

func (service *serviceStruct) TeacherAcademicYearListGet(teacherId string, pagination *helper.Pagination) ([]int, error) {
	return service.repositoryTeacherStudent.TeacherAcademicYearList(teacherId, pagination)
}
