package service

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type AuthCaseOAuthCallbackResponse struct {
	StatusCode int                `json:"status_code"`
	Data       *OAuthCallbackData `json:"data"`
	Message    string             `json:"message"`
}

type OAuthCallbackData struct {
	Provider string `json:"provider"`
	Code     string `json:"code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseOAuthCallback(context *fiber.Ctx) error {
	provider := context.Params("provider")
	code := context.Query("code")

	return context.Status(http.StatusOK).JSON(
		AuthCaseOAuthCallbackResponse{
			StatusCode: http.StatusOK,
			Data: &OAuthCallbackData{
				Provider: provider,
				Code:     code,
			},
			Message: "callback",
		},
	)
}

// ==================== Service ==========================
