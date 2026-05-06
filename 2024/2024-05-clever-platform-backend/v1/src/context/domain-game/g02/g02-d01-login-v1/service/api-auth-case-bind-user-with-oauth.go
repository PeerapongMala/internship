package service

import (
	"log"
	"net/http"
	"os"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type AuthCaseBindUserWithOauthRequest struct {
	Provider            string `params:"provider" validate:"required"`
	Email               string `json:"email" validate:"required"`
	Password            string `json:"password" validate:"required"`
	ProviderAccessToken string `json:"provider_access_token" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseByUserWithOauthResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseBindUserWithOauth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseBindUserWithOauthRequest{}, helper.ParseOptions{
		Body:   true,
		Params: true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.AuthCaseBindUserWithOauth(&AuthCaseBindUserWithOauthInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseByUserWithOauthResponse{
		StatusCode: http.StatusOK,
		Message:    "Bound",
	})
}

// ==================== Service ==========================

type AuthCaseBindUserWithOauthInput struct {
	*AuthCaseBindUserWithOauthRequest
}

func (service *serviceStruct) AuthCaseBindUserWithOauth(in *AuthCaseBindUserWithOauthInput) error {
	getOauthProfileOutput, err := service.GetOauthProfile(&GetOauthProfileInput{
		Provider:         in.Provider,
		OauthAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return err
	}

	userId, err := service.loginStorage.UserGetByEmail(in.Email)
	if err != nil {
		return err
	}

	authEmailPassword, err := service.loginStorage.AuthEmailPasswordGet(*userId)
	if err != nil {
		return err
	}

	if !helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password) {
		msg := "Wrong password"
		return helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	roles, err := service.loginStorage.UserCaseGetUserRoles(*userId)
	if err != nil {
		return err
	}

	tx, err := service.loginStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if slices.Contains(roles, int(constant.Teacher)) {
		isExists, err := service.loginStorage.AuthOAuthCheck(in.Provider, *userId, getOauthProfileOutput.SubjectId)
		if err != nil {
			return err
		}
		if isExists {
			return nil
		}

		err = service.loginStorage.AuthOauthCreate(tx, &constant.AuthOauthEntity{
			Provider:  in.Provider,
			UserId:    *userId,
			SubjectId: getOauthProfileOutput.SubjectId,
		})
		if err != nil {
			return err
		}

		if in.Provider == "line" {
			err = service.LinkWithRichMenu(&LinkWithRichMenuInput{
				UserId:     getOauthProfileOutput.SubjectId,
				RichMenuId: os.Getenv("TEACHER_RICH_MENU_ID"),
			})
			if err != nil {
				return err
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
