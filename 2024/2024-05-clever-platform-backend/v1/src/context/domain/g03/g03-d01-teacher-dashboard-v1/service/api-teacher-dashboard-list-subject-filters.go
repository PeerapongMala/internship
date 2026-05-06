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

type subjectFilterResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []subjectFilter   `json:"data"`
	Message    string            `json:"message"`
}

type subjectFilter struct {
	SubjectId int    `json:"subject_id"`
	Name      string `json:"name"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) ListSubjectFilters(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.ListSubjectFilterFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	pagination := helper.PaginationNew(context)

	subjectFilters, err := api.service.ListSubjectFilters(&listSubjectFiltersInput{
		TeacherId:    subjectId,
		AcademicYear: filter.AcademicYear,
		Year:         filter.Year,
		ClassIds:     filter.ClassIds,
		pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(subjectFilterResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       subjectFilters,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listSubjectFiltersInput struct {
	TeacherId    string
	AcademicYear int
	Year         string
	ClassIds     []int
	pagination   *helper.Pagination
}

func (service *serviceStruct) ListSubjectFilters(in *listSubjectFiltersInput) (outs []subjectFilter, err error) {
	outs = []subjectFilter{}
	subjects, err := service.storage.GetSubjectFromClassIds(in.ClassIds, in.pagination)
	if err != nil {
		err = fmt.Errorf("get subjects error: %s", err.Error())
		return
	}
	for _, s := range subjects {
		outs = append(outs, subjectFilter{
			SubjectId: s.Id,
			Name:      s.Name,
		})
	}
	return
}
