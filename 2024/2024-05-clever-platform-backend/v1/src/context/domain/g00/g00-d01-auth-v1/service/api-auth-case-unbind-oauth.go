package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthCaseUnbindOAuthRequest struct {
	UserId   string `json:"user_id" validate:"required"`
	Provider string `json:"provider" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseUnbindOAuthResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseUnbindOAuth
// @Tags Auth
// @Summary Unbind OAuth
// @Description Unbind OAuth
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body AuthCaseUnbindOAuthRequest true "request"
// @Success 200 {object} AuthCaseUnbindOAuthResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/oauth/unbind [post]
func (api *APIStruct) AuthCaseUnbindOAuth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseUnbindOAuthRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AuthCaseUnbindOAuth(&AuthCaseUnbindOAuthInput{
		UserId:   request.UserId,
		Provider: request.Provider,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(
		AuthCaseUnbindOAuthResponse{
			StatusCode: http.StatusOK,
			Message:    "Unbound",
		},
	)
}

// ==================== Service ==========================

type AuthCaseUnbindOAuthInput struct {
	UserId   string
	Provider string
}

func (service *serviceStruct) AuthCaseUnbindOAuth(in *AuthCaseUnbindOAuthInput) error {
	err := service.authStorage.AuthCaseUnbindOAuth(in.UserId, in.Provider)
	if err != nil {
		return err
	}

	return nil
}
