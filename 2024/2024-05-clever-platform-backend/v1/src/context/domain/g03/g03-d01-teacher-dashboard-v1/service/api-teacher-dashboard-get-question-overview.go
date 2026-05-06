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

type QuestionOverview struct {
	StatusCode int                    `json:"status_code"`
	Data       []questionOverviewData `json:"data"`
	Message    string                 `json:"message"`
}

type questionOverviewData struct {
	TotalQuestion  int `json:"total_question"`
	TotalLevel     int `json:"total_level"`
	LevelSubmitted int `json:"level_submitted"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetQuestionOverview(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetQuestionOverviewFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	result, err := api.service.GetQuestionOverview(&getQuestionOverviewInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		Year:          filter.Year,
		ClassIds:      filter.ClassIds,
		LessonId:      filter.LessonId,
		StudyGroupIds: filter.StudyGroupIds,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(QuestionOverview{
		StatusCode: http.StatusOK,
		Data:       []questionOverviewData{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getQuestionOverviewInput struct {
	TeacherId     string
	AcademicYear  int
	Year          string
	ClassIds      []int
	LessonId      int
	StudyGroupIds []int
}

func (service serviceStruct) GetQuestionOverview(in *getQuestionOverviewInput) (out questionOverviewData, err error) {
	out = questionOverviewData{
		TotalQuestion:  0,
		TotalLevel:     0,
		LevelSubmitted: 0,
	}

	levelIds, err := service.storage.GetClassLevels(in.ClassIds, in.LessonId, in.StudyGroupIds)
	if err != nil {
		err = fmt.Errorf("get level from class ids error: %s", err.Error())
		return
	}

	questions, err := service.storage.GetQuestionsFromLevelIds(levelIds)
	if err != nil {
		err = fmt.Errorf("get questions error: %s", err.Error())
		return
	}

	levelPlayLogs, err := service.storage.GetLevelPlayLogs(&constant.LevelPlayLogFilter{
		LevelIds:      levelIds,
		ClassIds:      in.ClassIds,
		StudyGroupIds: in.StudyGroupIds,
	})
	if err != nil {
		err = fmt.Errorf("get levels error: %s", err.Error())
		return
	}

	lplIds := make([]int, len(levelPlayLogs))
	for i, lpl := range levelPlayLogs {
		lplIds[i] = lpl.Id
	}

	qpls, err := service.storage.GetQuestionPlayLogsFromLevelPlayLogIds(lplIds)
	if err != nil {
		err = fmt.Errorf("get levels error: %s", err.Error())
		return
	}

	studentCount, err := service.storage.GetStudentCount(in.ClassIds)
	if err != nil {
		err = fmt.Errorf("get student count error: %s", err.Error())
		return
	}

	var (
		levelSubmitted = 0
		lplMap         = make(map[string]struct{})
	)

	for _, qpl := range qpls {
		key := fmt.Sprintf("%v-%s", qpl.QuestionId, qpl.StudentId)
		if _, exist := lplMap[key]; !exist {
			levelSubmitted++
			lplMap[key] = struct{}{}
		}
	}

	out.TotalQuestion = len(questions)                                    // total
	out.LevelSubmitted = levelSubmitted                                   // submitted
	out.TotalLevel = (len(questions) * studentCount) - out.LevelSubmitted // not submitted
	if out.TotalQuestion == 0 {
		out.TotalLevel = 0
		out.LevelSubmitted = 0
	}
	return
}
