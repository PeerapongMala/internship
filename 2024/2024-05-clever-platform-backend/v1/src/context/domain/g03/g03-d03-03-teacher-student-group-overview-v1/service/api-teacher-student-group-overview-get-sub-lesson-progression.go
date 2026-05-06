package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

type getSubLessonProgressionResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination helper.Pagination      `json:"_pagination"`
	Data       []subLessonProgression `json:"data"`
	Message    string                 `json:"message"`
}

type subLessonProgression struct {
	Scope    string  `json:"scope"`
	Progress float64 `json:"progress"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetSubLessonProgressions(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetLessonProgressionFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)
	result, err := api.service.GetSubLessonProgressions(&getSubLessonProgressionsInput{
		LessonId:     filter.LessonId,
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		StartAt:      filter.StartAt,
		EndAt:        filter.EndAt,
		Pagination:   pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(getSubLessonProgressionResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getSubLessonProgressionsInput struct {
	LessonId     int
	TeacherId    string
	StudyGroupId int
	StartAt      time.Time
	EndAt        time.Time
	Pagination   *helper.Pagination
}

func (service serviceStruct) GetSubLessonProgressions(in *getSubLessonProgressionsInput) (outs []subLessonProgression, err error) {
	outs = []subLessonProgression{}

	studyGroup, err := service.storage.GetStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("get study group from id error: %s", err.Error())
		return
	}

	progressReports, err := service.storage.GetSubLessonProgressions(
		studyGroup.ClassId,
		studyGroup.SubjectId,
		in.LessonId,
		studyGroup.Id,
		in.StartAt,
		in.EndAt,
		in.Pagination,
	)
	if err != nil {
		err = errors.Errorf("get sub lesson progressions error: %s", err.Error())
		return
	}

	for _, v := range progressReports {
		outs = append(
			outs,
			subLessonProgression{
				Scope:    v.Scope,
				Progress: v.Progress,
			},
		)
	}
	return
}
