package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type AuthCaseBindWithOAuthRequest struct {
	Provider            string `json:"provider" validate:"required"`
	SchoolCode          string `json:"school_code" validate:"required"`
	StudentId           string `json:"student_id" validate:"required"`
	ProviderAccessToken string `json:"provider_access_token" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseBindWithOAuthResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id AuthCaseBindStudentWithOAuth
// @Tags Auth
// @Summary Bind student with OAuth
// @Description Bind student with OAuth (Line, Google)
// @Accept json
// @Produce json
// @Param request body AuthCaseBindWithOAuthRequest true "request"
// @Success 200 {object} AuthCaseBindWithOAuthResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/oauth/bind [post]
func (api *APIStruct) AuthCaseBindStudentWithOAuth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseBindWithOAuthRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	if !slices.Contains(constant.OAuthProviderList, constant.OAuthProvider(request.Provider)) {
		msg := "Provider must be line / google / thaid"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	err = api.Service.AuthCaseBindStudentWithOAuth(&AuthCaseBindStudentWithOAuthInput{
		Provider:            &request.Provider,
		SchoolCode:          &request.SchoolCode,
		StudentId:           &request.StudentId,
		ProviderAccessToken: &request.ProviderAccessToken,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseBindWithOAuthResponse{
		StatusCode: http.StatusOK,
		Message:    "Bound",
	})
}

// ==================== Service ==========================

type AuthCaseBindStudentWithOAuthInput struct {
	Provider            *string
	SchoolCode          *string
	StudentId           *string
	ProviderAccessToken *string
}

func (serviceStruct *serviceStruct) AuthCaseBindStudentWithOAuth(in *AuthCaseBindStudentWithOAuthInput) error {
	authCaseFindOAuthProfileOutput, err := serviceStruct.AuthCaseFindOAuthProfile(&AuthCaseFindOAuthProfileInput{
		Provider:            in.Provider,
		ProviderAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return err
	}
	if authCaseFindOAuthProfileOutput.SubjectId == nil {
		err = helper.NewHttpError(http.StatusConflict, nil)
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	studentData, err := serviceStruct.userStorage.StudentList(&userConstant.StudentFilter{
		SchoolCode: *in.SchoolCode,
		StudentId:  *in.StudentId,
	}, nil)
	if err != nil {
		return err
	}
	if len(studentData) == 0 {
		err = helper.NewHttpError(http.StatusConflict, nil)
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	err = serviceStruct.authStorage.AuthCaseBindAccountWithOAuth(*in.Provider, studentData[0].Id, *authCaseFindOAuthProfileOutput.SubjectId)
	if err != nil {
		return err
	}

	return nil
}
