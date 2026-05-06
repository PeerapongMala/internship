package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
	"strconv"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetDDRScoreResult(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetDDRParams{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	teacherId, ok := ctx.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupStr := ctx.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studyGroupId, err := strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	result, err := api.Service.GetDDRScoreResult(teacherId, studyGroupId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return ctx.Status(http.StatusOK).JSON(constant.Response{
		StatusCode: http.StatusOK,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service serviceStruct) GetDDRScoreResult(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRScoreResult, error) {
	if in.LevelId == 0 {
		return constant.GetDDRScoreResult{}, nil
	}

	//Check Permission and Get StudentIds
	studentIds, err := service.storage.GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId, teacherId)
	if err != nil {
		return constant.GetDDRScoreResult{}, errors.New(fmt.Sprintf("get study group from id error: %s", err.Error()))
	}

	studentQuestionEnts, err := service.storage.GetQuestionStatByLevelIDAndStudentIds(in.LevelId, studentIds, in.Search)
	if err != nil {
		return constant.GetDDRScoreResult{}, err
	}

	count, err := service.storage.GetLevelQuestionCount(in.LevelId)
	if err != nil {
		return nil, err
	}

	defaultQuestions := []constant.QuestionByStudentStatEntity{}
	for i := 1; i <= count; i++ {
		zero := 0
		defaultQuestions = append(defaultQuestions, constant.QuestionByStudentStatEntity{
			QuestionIndex: i,
			Score:         &zero,
		})
	}

	studentStat := make([]constant.StudentQuestionStat, 0)
	for _, ent := range studentQuestionEnts {
		if ent.Questions == nil {
			ent.Questions = defaultQuestions
		}

		studentStat = append(studentStat, constant.StudentQuestionStat{
			StudentID:        ent.StudentID,
			StudentTitle:     ent.StudentTitle,
			StudentFirstName: ent.StudentFirstname,
			StudentLastName:  ent.StudentLastname,
			QuestionData:     ent.Questions,
			ScoreSum:         ent.ScoreSum,
		})
	}

	// Return the final result
	return studentStat, nil
}
