package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type AuthCaseGetOauthProfileRequest struct {
	Provider string `json:"provider" validate:"required"`
	AuthCode string `query:"auth_code" validate:"required"`
}

// ==================== Response =========================

type AuthCaseGetOauthProfileResponse struct {
	StatusCode int            `json:"status_code"`
	Data       []OauthProfile `json:"data"`
	Message    string         `json:"message"`
}

type OauthProfile struct {
	ProviderAccessToken string `json:"provider_access_token"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseGetOauthProfile(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseGetOauthProfileRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseGetOauthProfileOutput, err := api.Service.AuthCaseGetOauthProfile(&AuthCaseGetOauthProfileInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseGetOauthProfileResponse{
		StatusCode: http.StatusOK,
		Data:       []OauthProfile{{ProviderAccessToken: authCaseGetOauthProfileOutput.ProviderAccessToken}},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AuthCaseGetOauthProfileInput struct {
	*AuthCaseGetOauthProfileRequest
}

type AuthCaseGetOauthProfileOutput struct {
	ProviderAccessToken string
}

func (service *serviceStruct) AuthCaseGetOauthProfile(in *AuthCaseGetOauthProfileInput) (*AuthCaseGetOauthProfileOutput, error) {
	exchangeCodeForTokenOutput, err := service.ExchangeCodeForToken(&ExchangeCodeForTokenInput{
		in.Provider,
		in.AuthCode,
	})
	if err != nil {
		return nil, err
	}

	return &AuthCaseGetOauthProfileOutput{
		ProviderAccessToken: exchangeCodeForTokenOutput.OauthAccessToken,
	}, nil
}
