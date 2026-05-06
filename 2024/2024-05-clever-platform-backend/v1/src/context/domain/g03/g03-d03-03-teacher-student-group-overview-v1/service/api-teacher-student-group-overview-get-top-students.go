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

// ==================== Request ==========================

// ==================== Response ==========================

type getTopStudentResponse struct {
	StatusCode int          `json:"status_code"`
	Data       []topStudent `json:"data"`
	Message    string       `json:"message"`
}

type topStudent struct {
	StudentId string `json:"student_id"`
	Name      string `json:"name"`
	Score     int    `json:"score"`
}

// ==================== Endpint ==========================

func (api apiStruct) GetTopStudents(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetTopStudentsFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.LessonIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"lesson-ids is empty"}[0]))
	}
	result, err := api.service.GetTopStudents(&getTopStudentInput{
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		LessonIds:    filter.LessonIds,
		SubLessonIds: filter.SubLessonIds,
		Limit:        filter.Limit,
		StartAt:      filter.StartAt,
		EndAt:        filter.EndAt,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(getTopStudentResponse{
		StatusCode: http.StatusOK,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getTopStudentInput struct {
	TeacherId    string
	StudyGroupId int
	LessonIds    []int
	SubLessonIds []int
	Limit        *int
	StartAt      *time.Time
	EndAt        *time.Time
}

func (service serviceStruct) GetTopStudents(in *getTopStudentInput) (outs []topStudent, err error) {
	outs = []topStudent{}

	studyGroup, err := service.storage.GetStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("get study group from id error: %s", err.Error())
		return
	}

	studentScores, err := service.storage.GetTopStudentScore(studyGroup.ClassId, studyGroup.Id, constant.TopStudentScoreFilter{
		Limit:        in.Limit,
		SubLessonIds: in.SubLessonIds,
		StartAt:      in.StartAt,
		EndAt:        in.EndAt,
	})
	if err != nil {
		err = errors.Errorf("get top student score error: %s", err.Error())
		return
	}

	for _, ss := range studentScores {
		outs = append(outs, topStudent{
			StudentId: ss.StudentId,
			Name:      ss.FullName,
			Score:     ss.Sum,
		})
	}

	return
}
