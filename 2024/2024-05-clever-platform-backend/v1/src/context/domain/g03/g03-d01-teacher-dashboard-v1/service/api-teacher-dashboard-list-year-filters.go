package service

import (
	"fmt"
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type yearFilterResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []yearFilter      `json:"data"`
	Message    string            `json:"message"`
}

type yearFilter struct {
	Year string `json:"year"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) ListYearFilters(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.ListYearFilterFilter{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)

	yearFilters, err := api.service.ListYearFilters(&listYearFiltersInput{
		TeacherId:    subjectId,
		AcademicYear: filter.AcademicYear,
		Pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(yearFilterResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       yearFilters,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listYearFiltersInput struct {
	TeacherId    string
	AcademicYear *int
	Pagination   *helper.Pagination
}

func (service *serviceStruct) ListYearFilters(in *listYearFiltersInput) (yearFilters []yearFilter, err error) {
	yearFilters = []yearFilter{}

	// get school id
	schoolId, err := service.storage.GetTeacherSchoolId(in.TeacherId)
	if err != nil {
		err = fmt.Errorf("get teacher school id error: %s", err.Error())
		return
	}
	if schoolId == nil {
		err = errors.New("school id is null")
		return
	}

	// get class ids
	classIds, err := service.storage.GetTeacherClassIds(*schoolId, in.TeacherId, nil)
	if err != nil {
		err = fmt.Errorf("get teacher class ids error: %s", err.Error())
		return
	}
	if len(classIds) == 0 {
		return
	}

	filter := constant.ClassFilter{}
	if in.AcademicYear != nil {
		filter.AcademicYears = append(filter.AcademicYears, *in.AcademicYear)
	}

	// get classes
	classes, err := service.storage.GetClasses(
		classIds,
		&filter,
		in.Pagination,
	)
	if err != nil {
		err = fmt.Errorf("get classes error: %s", err.Error())
		return
	}
	if len(classIds) == 0 {
		return
	}

	curr := []string{}
	for _, c := range classes {
		if !slices.Contains(curr, c.Year) {
			yearFilters = append(yearFilters, yearFilter{
				Year: c.Year,
			})
			curr = append(curr, c.Year)
		}
	}
	return
}

// ==================== Helper ==========================
