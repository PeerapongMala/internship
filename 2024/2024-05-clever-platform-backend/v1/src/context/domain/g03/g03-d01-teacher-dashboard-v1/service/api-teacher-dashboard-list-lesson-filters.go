package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type lessonFilterResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []lessonFilter    `json:"data"`
	Message    string            `json:"message"`
}

type lessonFilter struct {
	SubjectId   int     `json:"subject_id"`
	SubjectName *string `json:"subject_name"`
	LessonIndex int     `json:"lesson_index"`
	LessonId    int     `json:"lesson_id"`
	Name        string  `json:"name"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) ListLessonFilters(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.ListLessonFilterFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	if len(filter.SubjectIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"subject_ids is empty"}[0]))
	}
	pagination := helper.PaginationNew(context)

	lessonFilters, err := api.service.ListLessonFilters(&listLessonFiltersInput{
		TeacherId:    subjectId,
		AcademicYear: filter.AcademicYear,
		Year:         filter.Year,
		ClassIds:     filter.ClassIds,
		SubjectIds:   filter.SubjectIds,
		pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(lessonFilterResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       lessonFilters,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listLessonFiltersInput struct {
	TeacherId    string
	AcademicYear int
	Year         string
	ClassIds     []int
	SubjectIds   []int
	pagination   *helper.Pagination
}

func (service *serviceStruct) ListLessonFilters(in *listLessonFiltersInput) (outs []lessonFilter, err error) {
	outs = []lessonFilter{}

	lessons, err := service.storage.GetLessonFromSubjectIds(in.SubjectIds, in.pagination)
	if err != nil {
		return
	}

	for _, l := range lessons {
		outs = append(outs, lessonFilter{
			SubjectId:   l.SubjectId,
			SubjectName: l.SubjectName,
			LessonIndex: l.Index,
			LessonId:    l.Id,
			Name:        l.Name,
		})
	}

	return
}
