package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthCaseUpdatePinRequest struct {
	UserId string `json:"user_id" validate:"required"`
	Pin    string `json:"pin" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseUpdatePinResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseUpdatePin
// @Tags Auth
// @Summary Update pin
// @Description Update pin
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body AuthCaseUpdatePinRequest true "request"
// @Success 200 {object} AuthCaseUpdatePinResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/pin [patch]
func (api *APIStruct) AuthCaseUpdatePin(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseUpdatePinRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AuthCaseUpdatePin(&AuthCaseUpdatePinInput{
		UserId: request.UserId,
		Pin:    request.Pin,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(
		AuthCaseUpdatePinResponse{
			StatusCode: http.StatusOK,
			Message:    "Pin updated",
		},
	)
}

// ==================== Service ==========================

type AuthCaseUpdatePinInput struct {
	UserId string
	Pin    string
}

func (service *serviceStruct) AuthCaseUpdatePin(in *AuthCaseUpdatePinInput) error {
	err := service.authStorage.AuthCaseUpdatePin(in.UserId, in.Pin)
	if err != nil {
		return err
	}

	return nil
}
