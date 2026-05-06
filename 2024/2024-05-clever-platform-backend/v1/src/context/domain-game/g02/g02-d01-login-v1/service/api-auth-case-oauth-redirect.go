package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthCaseOauthRedirect struct {
	Provider string `json:"provider" validate:"required"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseOAuthRedirect(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseOauthRedirect{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	if !slices.Contains(constant.OAuthProviderList, constant.OAuthProvider(request.Provider)) {
		msg := "OAuth provider not supported"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	url, err := helper.BuildOAuthUrl(constant.OAuthProvider(request.Provider))
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).Redirect(*url)
}

// ==================== Service ==========================
