package service

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
)

// ==================== Request ==========================

type LevelCaseListStudentAnswerRequest struct {
	LevelPlayLogId int `params:"levelPlayLogId" validate:"required"`
}

type LevelCaseListStudentAnswerResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.StudentAnswerEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseListStudentAnswer(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseListStudentAnswerRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	levelCaseListStudentAnswerOutput, err := api.Service.LevelCaseListStudentAnswer(&LevelCaseListStudentAnswerInput{
		Pagination:                        pagination,
		LevelCaseListStudentAnswerRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseListStudentAnswerResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelCaseListStudentAnswerOutput.Answers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelCaseListStudentAnswerInput struct {
	Pagination *helper.Pagination
	*LevelCaseListStudentAnswerRequest
}

type LevelCaseListStudentAnswerOutput struct {
	Answers []constant.StudentAnswerEntity
}

func (service *serviceStruct) LevelCaseListStudentAnswer(in *LevelCaseListStudentAnswerInput) (*LevelCaseListStudentAnswerOutput, error) {
	questionPlayLogs, err := service.academicLevelStorage.QuestionPlayLogList(in.LevelPlayLogId)
	if err != nil {
		return nil, err
	}
	in.Pagination.TotalCount = len(questionPlayLogs)

	studentAnswers := []constant.StudentAnswerEntity{}
	for _, questionPlayLog := range questionPlayLogs {
		var answer interface{}
		var err error
		var questionPlayLogId int
		if questionPlayLog.QuestionPlayLogId != nil {
			questionPlayLogId = *questionPlayLog.QuestionPlayLogId
		}
		switch *questionPlayLog.QuestionType {
		case constant.MultipleChoice:
			answer, err = service.academicLevelStorage.StudentMultipleChoiceAnswerGet(questionPlayLogId)
		case constant.Group:
			answer, err = service.academicLevelStorage.StudentGroupAnswerGet(questionPlayLogId)
		case constant.Sort:
			answer, err = service.academicLevelStorage.StudentSortAnswerGet(questionPlayLogId)
		case constant.Placeholder:
			answer, err = service.academicLevelStorage.StudentPlaceholderAnswerGet(questionPlayLogId)
		case constant.Input:
			answer, err = service.academicLevelStorage.StudentInputAnswerGet(questionPlayLogId)
		default:
			continue
		}
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			return nil, err
		}
		studentAnswerEntity := constant.StudentAnswerEntity{
			QuestionId:    *questionPlayLog.QuestionId,
			QuestionIndex: *questionPlayLog.QuestionIndex,
			QuestionType:  *questionPlayLog.QuestionType,
			TimeUsed:      questionPlayLog.TimeUsed,
			IsCorrect:     questionPlayLog.IsCorrect,
			Answer:        answer,
		}
		studentAnswers = append(studentAnswers, studentAnswerEntity)
	}

	return &LevelCaseListStudentAnswerOutput{
		studentAnswers,
	}, nil
}
