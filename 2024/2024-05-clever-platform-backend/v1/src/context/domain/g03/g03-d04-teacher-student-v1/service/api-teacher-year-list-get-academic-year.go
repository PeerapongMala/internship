package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type TeacherYearListGetByAcademicYearResponse struct {
	helper.PaginationResponse
	StatusCode int      `json:"status_code"`
	Message    string   `json:"message"`
	Data       []string `json:"data"`
}

func (api *APIStruct) TeacherYearListGetByAcademicYear(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationDropdown(context)

	academicYearStr := context.Params("academicYear")
	academicYear, err := strconv.Atoi(academicYearStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	years, err := api.Service.TeacherYearListGetByAcademicYear(teacherId, academicYear, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(TeacherYearListGetByAcademicYearResponse{
		PaginationResponse: helper.NewPaginationResponse(pagination),
		StatusCode:         http.StatusOK,
		Message:            "Success",
		Data:               years,
	})
}

func (service *serviceStruct) TeacherYearListGetByAcademicYear(teacherId string, academicYear int, pagination *helper.Pagination) ([]string, error) {
	return service.repositoryTeacherStudent.TeacherYearListByAcademicYear(teacherId, academicYear, pagination)
}
