package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type listSubLessonFiltersResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []subLessonFilter `json:"data"`
	Message    string            `json:"message"`
}

type subLessonFilter struct {
	LessonId int    `json:"lesson_id"`
	Name     string `json:"name"`
}

// ==================== Endpoint ==========================

func (api apiStruct) ListSubLessonFilters(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.ListSubLessonFilterFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)
	result, err := api.service.ListSubLessonFilters(&listSubLessonFiltersInput{
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		LessonId:     filter.LessonId,
		Pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(listSubLessonFiltersResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listSubLessonFiltersInput struct {
	TeacherId    string
	StudyGroupId int
	LessonId     int
	Pagination   *helper.Pagination
}

func (service serviceStruct) ListSubLessonFilters(in *listSubLessonFiltersInput) (outs []subLessonFilter, err error) {
	outs = []subLessonFilter{}

	subLessons, err := service.storage.ListSubLessons(in.LessonId, in.Pagination)
	if err != nil {
		err = errors.Errorf("get lessons error: %s", err.Error())
		return
	}

	for _, sl := range subLessons {
		out := subLessonFilter{
			LessonId: sl.Id,
		}
		if sl.Name != nil {
			out.Name = *sl.Name
		}
		outs = append(outs, out)
	}
	return
}
