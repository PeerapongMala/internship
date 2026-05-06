package service

import (
	"net/http"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type LevelCaseGetLastPlayRequest struct {
	SubLessonId int `query:"sub_lesson_id"`
	LessonId    int `query:"lesson_id"`
	SubjectId   int `query:"subject_id"`
}

// ==================== Response ==========================

type LevelCaseGetLastPlayResponse struct {
	StatusCode int                             `json:"status_code"`
	Data       []constant2.LastPlayLevelEntity `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseGetLastPlay(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseGetLastPlayRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	levelCaseGetLastPlayOutput, err := api.Service.LevelCaseGetLastPlay(&LevelCaseGetLastPlayInput{
		LevelCaseGetLastPlayRequest: request,
		UserId:                      userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseGetLastPlayResponse{
		StatusCode: http.StatusOK,
		Data:       []constant2.LastPlayLevelEntity{*levelCaseGetLastPlayOutput.LastPlayLevel},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelCaseGetLastPlayInput struct {
	*LevelCaseGetLastPlayRequest
	UserId string
}

type LevelCaseGetLastPlayOutput struct {
	LastPlayLevel *constant2.LastPlayLevelEntity
}

func (service *serviceStruct) LevelCaseGetLastPlay(in *LevelCaseGetLastPlayInput) (*LevelCaseGetLastPlayOutput, error) {
	lastPlayLevel, err := service.levelStorage.LevelCaseGetLastPlay(in.SubLessonId, in.LessonId, in.SubjectId, in.UserId)
	if err != nil {
		return nil, err
	}
	return &LevelCaseGetLastPlayOutput{
		LastPlayLevel: lastPlayLevel,
	}, nil
}
