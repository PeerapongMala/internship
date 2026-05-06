package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================
type EvaluationFormSettingGetScoreRequest struct {
	StudentId   int                                         `json:"student_id"`
	SheetId     int                                         `json:"sheet_id"`
	IndicatorId int                                         `json:"indicator_id"`
	SchoolId    int                                         `json:"school_id"`
	Setting     []constant.GradeEvaluationFormSettingEntity `json:"setting"`
}

// ==================== Response ==========================
type EvaluationFormSettingGetScoreResponse struct {
	StatusCode int                     `json:"status_code"`
	Data       []constant.StudentScore `json:"data"`
	Message    string                  `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationFormSettingGetScore(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &EvaluationFormSettingGetScoreRequest{}, helper.ParseOptions{Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.EvaluationFormSettingGetScore(&EvaluationFormSettingGetScoreInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationFormSettingGetScoreResponse{
		StatusCode: http.StatusOK,
		Data:       output.Scores,
		Message:    "Data retrieved",
	})
}

type EvaluationFormSettingGetScoreInput struct {
	*EvaluationFormSettingGetScoreRequest
}

type EvaluationFormSettingGetScoreOutput struct {
	Scores []constant.StudentScore
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationFormSettingGetScore(in *EvaluationFormSettingGetScoreInput) (*EvaluationFormSettingGetScoreOutput, error) {
	out, err := service.CalculateScore(&CalculateScoreInput{
		SheetId: in.SheetId,
		Students: []constant.EvaluationStudentEntity{
			{
				ID: in.StudentId,
			},
		},
		SchoolId:    in.SchoolId,
		IndicatorId: in.IndicatorId,
		IsAdvance:   true,
	})
	if err != nil {
		return nil, err
	}

	return &EvaluationFormSettingGetScoreOutput{
		Scores: out.StudentScores,
	}, nil
}
