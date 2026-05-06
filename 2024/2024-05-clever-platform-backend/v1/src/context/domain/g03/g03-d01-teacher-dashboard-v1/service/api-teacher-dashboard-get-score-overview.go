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

type ScoreOverview struct {
	StatusCode int                 `json:"status_code"`
	Data       []scoreOverviewData `json:"data"`
	Message    string              `json:"message"`
}

type scoreOverviewData struct {
	TotalScore   int     `json:"total_score"`
	StudentScore float64 `json:"student_score"`
	Percent      float64 `json:"percent"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetScoreOverview(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetScoreOverviewFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	result, err := api.service.GetScoreOverview(&getScoreOverviewInput{
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
	return context.Status(http.StatusOK).JSON(ScoreOverview{
		StatusCode: http.StatusOK,
		Data:       []scoreOverviewData{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getScoreOverviewInput struct {
	TeacherId     string
	AcademicYear  int
	Year          string
	ClassIds      []int
	LessonId      int
	StudyGroupIds []int
}

func (service serviceStruct) GetScoreOverview(in *getScoreOverviewInput) (out scoreOverviewData, err error) {
	out = scoreOverviewData{
		TotalScore:   0,
		StudentScore: 0,
	}

	levelIds, err := service.storage.GetClassLevels(in.ClassIds, in.LessonId, in.StudyGroupIds)
	if err != nil {
		return
	}

	tmp, err := service.storage.GetClassStudents(in.ClassIds, in.StudyGroupIds)
	if err != nil {
		return
	}
	studentIds := []string{}
	for _, t := range tmp {
		studentIds = append(studentIds, t.StudentId)
	}

	out.TotalScore = len(levelIds) * 3
	tmp2, err := service.storage.GetMaxScoreCount(levelIds, studentIds)
	if err != nil {
		return
	}
	if len(studentIds) != 0 {
		out.StudentScore = helper.Round(float64(tmp2) / float64(len(studentIds)))
	}
	if out.TotalScore != 0 {
		out.Percent = helper.Round(out.StudentScore / float64(out.TotalScore) * 100)
	}

	//levels, err := service.storage.GetLevelsFromClassIds(in.ClassIds)
	//if err != nil {
	//	err = fmt.Errorf("get level from class ids error: %s", err.Error())
	//	return
	//}
	//
	//levelIds := []int{}
	//for _, l := range levels {
	//	levelIds = append(levelIds, l.Id)
	//}

	//questions, err := service.storage.GetQuestionsFromLevelIds(levelIds)
	//if err != nil {
	//	err = fmt.Errorf("get question from level ids error: %s", err.Error())
	//	return
	//}
	//
	//levelPlayLogs, err := service.storage.GetLevelPlayLogs(&constant.LevelPlayLogFilter{
	//	Ids:      levelIds,
	//	ClassIds: in.ClassIds,
	//})
	//if err != nil {
	//	err = fmt.Errorf("get levels error: %s", err.Error())
	//	return
	//}
	//
	//lplIds := make([]int, len(levelPlayLogs))
	//for i, lpl := range levelPlayLogs {
	//	lplIds[i] = lpl.Id
	//}
	//
	//qpls, err := service.storage.GetQuestionPlayLogsFromLevelPlayLogIds(lplIds)
	//if err != nil {
	//	err = fmt.Errorf("get levels error: %s", err.Error())
	//	return
	//}
	//
	//var (
	//	totalScore   = len(questions) * 3
	//	studentScore = 0
	//	qplMap       = make(map[int]struct{})
	//)
	//
	//for _, qpl := range qpls {
	//	if qpl.IsCorrect {
	//		if _, exist := qplMap[qpl.QuestionId]; !exist {
	//			studentScore += 3
	//			qplMap[qpl.QuestionId] = struct{}{}
	//		}
	//	}
	//}
	return
}
