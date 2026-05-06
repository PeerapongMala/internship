package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type AuthCaseAdminLoginAsRequest struct {
	Email      string `json:"email" validate:"required"`
	Password   string `json:"password" validate:"required"`
	SchoolCode string `json:"school_code" validate:"required"`
	StudentId  string `json:"student_id" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseAdminLoginAsResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.AdminLoginAsEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseAdminLoginAs(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseAdminLoginAsRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseAdminLoginAsOutput, err := api.Service.AuthCaseAdminLoginAs(&AuthCaseAdminLoginAsInput{
		AuthCaseAdminLoginAsRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthCaseAdminLoginAsResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.AdminLoginAsEntity{{StudentEntity: authCaseAdminLoginAsOutput.StudentEntity, AdminId: authCaseAdminLoginAsOutput.AdminId, AdminTitle: authCaseAdminLoginAsOutput.AdminTitle, AdminFirstName: authCaseAdminLoginAsOutput.AdminFirstName, AdminLastName: authCaseAdminLoginAsOutput.AdminLastName}},
		Message:    "Login successfully",
	})
}

// ==================== Service ==========================

type AuthCaseAdminLoginAsInput struct {
	*AuthCaseAdminLoginAsRequest
}

type AuthCaseAdminLoginAsOutput struct {
	*constant.StudentEntity
	AdminId        string
	AdminTitle     string
	AdminFirstName string
	AdminLastName  string
}

func (service *serviceStruct) AuthCaseAdminLoginAs(in *AuthCaseAdminLoginAsInput) (*AuthCaseAdminLoginAsOutput, error) {
	authEmailPassword, err := service.loginStorage.AdminAuthEmailPasswordGet(in.Email)
	if err != nil {
		return nil, err
	}

	user, err := service.loginStorage.UserGet(in.Email)
	if err != nil {
		return nil, err
	}

	isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)

	if !isMatched {
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	student, err := service.loginStorage.StudentCaseGetBySchoolCodeStudentId(in.SchoolCode, in.StudentId)
	if err != nil {
		return nil, err
	}

	accessToken, err := helper.GenerateJwt(student.UserId)
	if err != nil {
		return nil, err
	}
	student.AccessToken = *accessToken

	if student.ImagePath != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*student.ImagePath)
		if err != nil {
			return nil, err
		}
		student.SchoolImage = url
	}

	return &AuthCaseAdminLoginAsOutput{
		StudentEntity:  student,
		AdminId:        authEmailPassword.UserId,
		AdminTitle:     user.Title,
		AdminFirstName: user.FirstName,
		AdminLastName:  user.LastName,
	}, nil
}
