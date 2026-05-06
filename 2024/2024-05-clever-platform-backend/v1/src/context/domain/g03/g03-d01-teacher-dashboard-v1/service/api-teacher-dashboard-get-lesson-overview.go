package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type LessonOverview struct {
	StatusCode int                  `json:"status_code"`
	Pagination helper.Pagination    `json:"_pagination"`
	Data       []lessonOverviewData `json:"data"`
	Message    string               `json:"message"`
}

type lessonOverviewData struct {
	Scope    string  `json:"scope"`
	Progress float64 `json:"progress"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetLessonOverview(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetLessonOverviewFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	pagination := helper.PaginationNew(context)

	result, err := api.service.GetLessonOverview(&getLessonOverviewInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		StartAt:       filter.StartAt,
		EndAt:         filter.EndAt,
		Year:          filter.Year,
		ClassIds:      filter.ClassIds,
		StudyGroupIds: filter.StudyGroupIds,
		SubjectIds:    filter.SubjectIds,
		Pagination:    pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(LessonOverview{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getLessonOverviewInput struct {
	TeacherId     string
	AcademicYear  int
	StartAt       time.Time
	EndAt         time.Time
	Year          string
	ClassIds      []int
	StudyGroupIds []int
	SubjectIds    []int
	Pagination    *helper.Pagination
}

func (service serviceStruct) GetLessonOverview(in *getLessonOverviewInput) (out []lessonOverviewData, err error) {
	out = []lessonOverviewData{}

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

	// get progress
	result, err := service.storage.GetLessonProgressOverview(
		*schoolId,
		in.ClassIds,
		in.StudyGroupIds,
		in.SubjectIds,
		in.StartAt,
		in.EndAt,
		in.Pagination,
	)
	if err != nil {
		return
	}
	for _, r := range result {
		out = append(out, lessonOverviewData{
			Scope:    r.Scope,
			Progress: r.Progress,
		})
	}
	return
}
