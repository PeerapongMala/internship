package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type AuthCaseLoginWithPinRequest struct {
	SchoolCode string `json:"school_code" validate:"required"`
	StudentId  string `json:"student_id" validate:"required"`
	Pin        string `json:"pin" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseLoginWithPinResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.StudentEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseLoginWithPin(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseLoginWithPinRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseLoginWithPinOutput, err := api.Service.AuthCaseLoginWithPin(&AuthCaseLoginWithPinInput{
		AuthCaseLoginWithPinRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseLoginWithPinResponse{
		StatusCode: http.StatusOK,
		Data: []constant.StudentEntity{
			*authCaseLoginWithPinOutput.StudentEntity,
		},
		Message: "Login Successfully",
	})

}

// ==================== Service ==========================

type AuthCaseLoginWithPinInput struct {
	*AuthCaseLoginWithPinRequest
}

type AuthCaseLoginWithPinOutput struct {
	*constant.StudentEntity
}

func (service *serviceStruct) AuthCaseLoginWithPin(in *AuthCaseLoginWithPinInput) (*AuthCaseLoginWithPinOutput, error) {
	student, err := service.loginStorage.StudentCaseGetBySchoolCodeStudentId(in.SchoolCode, in.StudentId)
	if err != nil {
		return nil, err
	}

	if student.Status != constant.Enabled {
		msg := "Account isn't enabled"
		return nil, helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	auth, err := service.loginStorage.AuthPinCaseGetByUserId(student.UserId)
	if err != nil {
		return nil, err
	}

	if in.Pin != auth.Pin {
		msg := "Wrong password"
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

	if student.ImagePath != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*student.ImagePath)
		if err != nil {
			return nil, err
		}
		student.SchoolImage = url
	}

	return &AuthCaseLoginWithPinOutput{
		student,
	}, nil
}
