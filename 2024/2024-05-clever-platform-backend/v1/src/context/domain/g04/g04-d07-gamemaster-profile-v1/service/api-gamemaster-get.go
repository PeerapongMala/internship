package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GamemasterGetResponse struct {
	StatusCode int `json:"status_code"`
	Data       []constant.UserEntity
	Message    string `json:"message"`
}

func (api *APIStruct) GamemasterGet(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	gamemasterGetOutput, err := api.Service.GamemasterGet(&GamemasterGetInput{
		GamemasterId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GamemasterGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.UserEntity{*gamemasterGetOutput.UserEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type GamemasterGetInput struct {
	GamemasterId string
}

type GamemasterGetOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) GamemasterGet(in *GamemasterGetInput) (*GamemasterGetOutput, error) {
	gamemaster, err := service.gamemasterProfileStorage.UserGet(in.GamemasterId)
	if err != nil {
		return nil, err
	}

	if gamemaster.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*gamemaster.ImageUrl)
		if err != nil {
			return nil, err
		}
		gamemaster.ImageUrl = url
	}

	return &GamemasterGetOutput{
		gamemaster,
	}, nil
}
