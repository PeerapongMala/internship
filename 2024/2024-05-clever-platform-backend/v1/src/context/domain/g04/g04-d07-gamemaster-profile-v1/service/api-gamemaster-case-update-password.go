package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type GamemasterCaseUpdatePasswordRequest struct {
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type GamemasterCaseUpdatePasswordResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GamemasterCaseUpdatePassword(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GamemasterCaseUpdatePasswordRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.GamemasterCaseUpdatePassword(&GamemasterCaseUpdatePasswordInput{
		UserId:   subjectId,
		Password: request.Password,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GamemasterCaseUpdatePasswordResponse{
		StatusCode: http.StatusOK,
		Message:    "Password updated",
	})
}

// ==================== Service ==========================

type GamemasterCaseUpdatePasswordInput struct {
	UserId   string
	Password string
}

func (service *serviceStruct) GamemasterCaseUpdatePassword(in *GamemasterCaseUpdatePasswordInput) error {
	passwordHash, err := helper.HashAndSalt(in.Password)
	if err != nil {
		return err
	}

	err = service.gamemasterProfileStorage.AuthCaseUpdatePassword(in.UserId, *passwordHash)
	if err != nil {
		return err
	}

	return nil
}
