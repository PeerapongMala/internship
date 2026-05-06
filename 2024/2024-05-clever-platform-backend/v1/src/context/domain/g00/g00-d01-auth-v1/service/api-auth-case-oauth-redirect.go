package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================
type AuthCaseOAuthRedirectResponse struct {
	Message string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseOAuthRedirect
// @Tags Auth
// @Summary Redirect to OAuth login page
// @Description Redirect to OAuth login page
// @Param provider path string true "provider"
// @Success 200 {object} AuthCaseOAuthRedirectResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Router /auth/v1/oauth/{provider}/redirect [get]
func (api *APIStruct) AuthCaseOAuthRedirect(context *fiber.Ctx) error {
	providerString := context.Params("provider")
	provider := constant.OAuthProvider(providerString)
	if !slices.Contains(constant.OAuthProviderList, provider) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	url, err := helper.BuildOAuthUrl(provider)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	return context.Status(http.StatusOK).Redirect(*url)
}

// ==================== Service ==========================
