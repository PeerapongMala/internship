package service

import (
	"net/http"
	"net/url"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type TeacherClassListGetByAcademicYearAndYearResponse struct {
	helper.PaginationResponse
	StatusCode int      `json:"status_code"`
	Message    string   `json:"message"`
	Data       []string `json:"data"`
}

func (api *APIStruct) TeacherClassListGetByAcademicYearAndYear(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	academicYearStr := context.Params("academicYear")
	academicYear, err := strconv.Atoi(academicYearStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	year, err := url.QueryUnescape(context.Params("year"))
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	pagination := helper.PaginationDropdown(context)
	classes, err := api.Service.TeacherClassListGetByAcademicYearAndYear(
		teacherId,
		academicYear,
		year,
		pagination,
	)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(TeacherClassListGetByAcademicYearAndYearResponse{
		PaginationResponse: helper.NewPaginationResponse(pagination),
		StatusCode:         http.StatusOK,
		Message:            "Success",
		Data:               classes,
	})
}

func (service *serviceStruct) TeacherClassListGetByAcademicYearAndYear(
	teacherId string,
	academicYear int,
	year string,
	pagination *helper.Pagination,
) ([]string, error) {
	return service.repositoryTeacherStudent.TeacherClassNameByAcademicYearAndYear(
		teacherId,
		academicYear,
		year,
	)
}
