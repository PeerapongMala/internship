package service

import (
	"log"
	"net/http"
	"time"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type AuthCaseLoginWithOAuthRequest struct {
	Provider            string `json:"provider" validate:"required"`
	ProviderAccessToken string `json:"provider_access_token" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseLoginWithOAuthResponse struct {
	StatusCode int                  `json:"status_code"`
	Data       []LoginWithOAuthData `json:"data"`
	Message    string               `json:"message"`
}

type LoginWithOAuthData struct {
	AccessToken *string `json:"access_token"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseLoginWithOAuth
// @Tags Auth
// @Summary Login with OAuth
// @Description Login with OAuth
// @Accept json
// @Produce json
// @Param request body AuthCaseLoginWithOAuthRequest true "request"
// @Success 200 {object} AuthCaseLoginWithOAuthResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/oauth/login [post]
func (api *APIStruct) AuthCaseLoginWithOAuth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseLoginWithOAuthRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseLoginWithOAuthOutput, err := api.Service.AuthCaseLoginWithOAuth(&AuthCaseLoginWithOAuthInput{
		Provider:            &request.Provider,
		ProviderAccessToken: &request.ProviderAccessToken,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseLoginWithOAuthResponse{
		StatusCode: http.StatusOK,
		Data: []LoginWithOAuthData{{
			AccessToken: authCaseLoginWithOAuthOutput.AccessToken,
		}},
		Message: "Login successfully",
	})
}

// ==================== Service ==========================

type AuthCaseLoginWithOAuthInput struct {
	Provider            *string
	ProviderAccessToken *string
}

type AuthCaseLoginWithOAuthOutput struct {
	AccessToken *string
}

func (service *serviceStruct) AuthCaseLoginWithOAuth(in *AuthCaseLoginWithOAuthInput) (*AuthCaseLoginWithOAuthOutput, error) {
	authCaseFindOAuthProfileOutput, err := service.AuthCaseFindOAuthProfile(&AuthCaseFindOAuthProfileInput{
		Provider:            in.Provider,
		ProviderAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return nil, err
	}

	userId, err := service.authStorage.AuthCaseLoginWithOAuth(*authCaseFindOAuthProfileOutput.SubjectId)
	if userId == nil {
		err = helper.NewHttpError(http.StatusNotFound, nil)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if err != nil {
		return nil, err
	}

	user, err := service.userStorage.UserGet(*userId)
	if err != nil {
		return nil, err
	}
	if user.Status != string(constant2.Enabled) {
		err := helper.NewHttpError(http.StatusUnauthorized, nil)
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	now := time.Now().UTC()
	_, err = service.userStorage.UserUpdate(nil, &constant2.UserEntity{
		Id:        user.Id,
		LastLogin: &now})
	if err != nil {
		return nil, err
	}

	accessToken, err := helper.GenerateJwt(user.Id)
	if err != nil {
		return nil, err
	}

	return &AuthCaseLoginWithOAuthOutput{
		AccessToken: accessToken,
	}, nil
}
