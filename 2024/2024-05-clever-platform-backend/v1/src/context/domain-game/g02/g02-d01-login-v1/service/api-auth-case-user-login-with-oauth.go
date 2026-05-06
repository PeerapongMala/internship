package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	g01D07Constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ==========================

type AuthCaseUserLoginWithOauthRequest struct {
	Provider            string `params:"provider" validate:"required"`
	ProviderAccessToken string `json:"provider_access_token" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseUserLoginWithOauthResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) AuthCaseUserLoginWithOauth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseUserLoginWithOauthRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseLoginWithOauthOutput, err := api.Service.AuthCaseUserLoginWithOauth(&AuthCaseUserLoginWithOauthInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseUserLoginWithOauthResponse{
		StatusCode: http.StatusOK,
		Data: []constant.UserEntity{
			*authCaseLoginWithOauthOutput.UserEntity,
		},
		Message: "Login successfully",
	})
}

// ==================== Service ==========================

type AuthCaseUserLoginWithOauthInput struct {
	*AuthCaseUserLoginWithOauthRequest
}

type AuthCaseUserLoginWithOauthOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) AuthCaseUserLoginWithOauth(in *AuthCaseUserLoginWithOauthInput) (*AuthCaseUserLoginWithOauthOutput, error) {
	getOauthProfile, err := service.GetOauthProfile(&GetOauthProfileInput{
		Provider:         in.Provider,
		OauthAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return nil, err
	}

	user, err := service.loginStorage.UserGetBySubjectId(getOauthProfile.SubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if user.Status != constant.Enabled {
		msg := "Account isn't enabled"
		return nil, helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	accessToken, err := helper.GenerateJwt(user.Id)
	if err != nil {
		return nil, err
	}
	user.AccessToken = *accessToken

	now := time.Now().UTC()
	_, err = service.loginStorage.UserUpdate(nil, &constant.UserEntity{
		Id:        user.Id,
		LastLogin: &now,
	})
	if err != nil {
		return nil, err
	}

	if user.SchoolImage != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.SchoolImage)
		if err != nil {
			return nil, err
		}
		user.SchoolImage = url
	}

	roles, err := service.loginStorage.UserCaseGetUserRoles(user.Id)
	if err != nil {
		return nil, err
	}
	user.Roles = roles

	var isSubjectTeacher bool
	subjects, err := service.loginStorage.SubjectTeacherGet(user.Id)
	if err != nil {
		return nil, err
	}
	if len(subjects) > 0 {
		isSubjectTeacher = true
	}
	user.IsSubjectTeacher = isSubjectTeacher
	user.Subject = subjects

	var academicYear *int
	teacherRoles := []int{}
	isTeacher := slices.Contains(roles, int(g01D07Constant.Teacher))
	if isTeacher {
		if user.SchoolId != nil {
			academicYear, err = service.loginStorage.CurrentAcademicYearGet(*user.SchoolId)
			if err != nil {
				return nil, err
			}
			if academicYear != nil {
				user.AcademicYear = academicYear
			}

			teacherRoles, err = service.loginStorage.TeacherAccessRoleGetByUserID(user.Id)
			if err != nil {
				return nil, err
			}
			user.TeacherRoles = teacherRoles
		}
	}

	return &AuthCaseUserLoginWithOauthOutput{
		user,
	}, nil
}
