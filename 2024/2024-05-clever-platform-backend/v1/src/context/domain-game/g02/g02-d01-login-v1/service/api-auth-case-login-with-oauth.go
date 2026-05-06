package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type AuthCaseLoginWithOauthRequest struct {
	Provider            string `params:"provider" validate:"required"`
	ProviderAccessToken string `json:"provider_access_token" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseLoginWithOauthResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.StudentEntity `json:"data"`
	Message    string                   `json:"message"`
}

func (api *APIStruct) AuthCaseLoginWithOauth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseLoginWithOauthRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseLoginWithOauthOutput, err := api.Service.AuthCaseLoginWithOauth(&AuthCaseLoginWithOauthInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseLoginWithOauthResponse{
		StatusCode: http.StatusOK,
		Data: []constant.StudentEntity{
			*authCaseLoginWithOauthOutput.StudentEntity,
		},
		Message: "Login successfully",
	})
}

// ==================== Service ==========================

type AuthCaseLoginWithOauthInput struct {
	*AuthCaseLoginWithOauthRequest
}

type AuthCaseLoginWithOauthOutput struct {
	*constant.StudentEntity
}

func (service *serviceStruct) AuthCaseLoginWithOauth(in *AuthCaseLoginWithOauthInput) (*AuthCaseLoginWithOauthOutput, error) {
	getOauthProfile, err := service.GetOauthProfile(&GetOauthProfileInput{
		Provider:         in.Provider,
		OauthAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return nil, err
	}

	student, err := service.loginStorage.StudentCaseGetBySubjectId(getOauthProfile.SubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if student.Status != constant.Enabled {
		msg := "Account isn't enabled"
		return nil, helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	accessToken, err := helper.GenerateJwt(student.UserId)
	if err != nil {
		return nil, err
	}
	student.AccessToken = *accessToken

	now := time.Now().UTC()
	_, err = service.loginStorage.UserUpdate(nil, &constant.UserEntity{
		Id:        student.UserId,
		LastLogin: &now,
	})
	if err != nil {
		return nil, err
	}

	if student.SchoolImage != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*student.SchoolImage)
		if err != nil {
			return nil, err
		}
		student.SchoolImage = url
	}

	return &AuthCaseLoginWithOauthOutput{
		student,
	}, nil
}
