package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type classFilterResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []classFilter     `json:"data"`
	Message    string            `json:"message"`
}

type classFilter struct {
	ClassId int    `json:"class_id"`
	Name    string `json:"name"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) ListClassFilters(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.ListClassFilterFilter{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)

	classFilters, err := api.service.ListClassFilters(&listClassFiltersInput{
		TeacherId:    subjectId,
		AcademicYear: filter.AcademicYear,
		Year:         filter.Year,
		Pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(classFilterResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       classFilters,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listClassFiltersInput struct {
	TeacherId    string
	AcademicYear *int
	Year         *string
	Pagination   *helper.Pagination
}

func (service *serviceStruct) ListClassFilters(in *listClassFiltersInput) (classFilters []classFilter, err error) {
	classFilters = []classFilter{}

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
	if in.Year != nil {
		filter.Years = append(filter.Years, *in.Year)
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

	for _, c := range classes {
		classFilters = append(classFilters, classFilter{
			ClassId: c.Id,
			Name:    c.Name,
		})
	}
	return
}

// ==================== Helper ==========================
