package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"
)

// ==================== Request ===========================

type LevelDataGetRequest struct {
	LevelId int `params:"levelId" validate:"required"`
}

// ==================== Response ==========================

type LevelDataGetResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.LevelDataEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelDataGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelDataGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	levelDataGetOutput, err := api.Service.LevelDataGet(&LevelDataGetInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	log.Println(levelDataGetOutput)

	return context.Status(http.StatusOK).JSON(LevelDataGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.LevelDataEntity{levelDataGetOutput.LevelData},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelDataGetInput struct {
	*LevelDataGetRequest
}

type LevelDataGetOutput struct {
	LevelData constant.LevelDataEntity
}

func (service *serviceStruct) LevelDataGet(in *LevelDataGetInput) (*LevelDataGetOutput, error) {
	levelData, err := service.gamificationStorage.LevelDataGet(in.LevelId)
	if err != nil {
		return nil, err
	}
	log.Println("test level data ", levelData)

	return &LevelDataGetOutput{
		LevelData: *levelData,
	}, nil
}
