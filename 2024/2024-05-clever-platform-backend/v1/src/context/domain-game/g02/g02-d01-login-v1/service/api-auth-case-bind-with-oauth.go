package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"os"
)

// ==================== Request ==========================

type AuthCaseBindWithOauthRequest struct {
	Provider            string `params:"provider" validate:"required"`
	SchoolCode          string `json:"school_code" validate:"required"`
	StudentId           string `json:"student_id" validate:"required"`
	Pin                 string `json:"pin" validate:"required"`
	ProviderAccessToken string `json:"provider_access_token" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseBindWithOauthResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseBindWithOauth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseBindWithOauthRequest{}, helper.ParseOptions{
		Body:   true,
		Params: true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.AuthCaseBindWithOauth(&AuthCaseBindWithOauthInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseBindWithOauthResponse{
		StatusCode: http.StatusOK,
		Message:    "Bound",
	})
}

// ==================== Service ==========================

type AuthCaseBindWithOauthInput struct {
	*AuthCaseBindWithOauthRequest
}

func (service *serviceStruct) AuthCaseBindWithOauth(in *AuthCaseBindWithOauthInput) error {
	getOauthProfileOutput, err := service.GetOauthProfile(&GetOauthProfileInput{
		Provider:         in.Provider,
		OauthAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return err
	}

	student, err := service.loginStorage.StudentCaseGetBySchoolCodeStudentId(in.SchoolCode, in.StudentId)
	if err != nil {
		return err
	}

	authPin, err := service.loginStorage.AuthPinCaseGetByUserId(student.UserId)
	if err != nil {
		return err
	}

	if authPin.Pin != in.Pin {
		msg := "Wrong pin"
		return helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	tx, err := service.loginStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.loginStorage.AuthOauthCreate(tx, &constant.AuthOauthEntity{
		Provider:  in.Provider,
		UserId:    student.UserId,
		SubjectId: getOauthProfileOutput.SubjectId,
	})
	if err != nil {
		return err
	}

	if in.Provider == "line" {
		err = service.LinkWithRichMenu(&LinkWithRichMenuInput{
			UserId:     getOauthProfileOutput.SubjectId,
			RichMenuId: os.Getenv("STUDENT_RICH_MENU_ID"),
		})
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
