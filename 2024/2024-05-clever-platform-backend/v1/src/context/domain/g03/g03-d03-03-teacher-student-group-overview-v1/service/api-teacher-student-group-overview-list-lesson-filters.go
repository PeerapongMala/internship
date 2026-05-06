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

type listLessonFiltersResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []lessonFilter    `json:"data"`
	Message    string            `json:"message"`
}

type lessonFilter struct {
	LessonId int    `json:"lesson_id"`
	Name     string `json:"name"`
}

// ==================== Endpoint ==========================

func (api apiStruct) ListLessonFilters(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.ListLessonFilterFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)
	result, err := api.service.ListLessonFilters(&listLessonFiltersInput{
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		Pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(listLessonFiltersResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listLessonFiltersInput struct {
	TeacherId    string
	StudyGroupId int
	Pagination   *helper.Pagination
}

func (service serviceStruct) ListLessonFilters(in *listLessonFiltersInput) (out []lessonFilter, err error) {
	out = []lessonFilter{}

	studyGroup, err := service.storage.GetStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("get study group from id error: %s", err.Error())
		return
	}

	lessons, err := service.storage.ListLessons(studyGroup.SubjectId, in.Pagination)
	if err != nil {
		err = errors.Errorf("get lessons error: %s", err.Error())
		return
	}

	for _, l := range lessons {
		out = append(out, lessonFilter{
			LessonId: l.Id,
			Name:     l.Name,
		})
	}
	return
}
