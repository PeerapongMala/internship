package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type AuthCaseCheckAdminRequest struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseCheckAdminResponse struct {
	StatusCode int       `json:"status_code"`
	Data       []IsAdmin `json:"data"`
	Message    string    `json:"message"`
}

type IsAdmin struct {
	IsAdmin bool `json:"is_admin"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthCaseCheckAdmin(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseCheckAdminRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	authCaseAdminOutput, err := api.Service.AuthCaseCheckAdmin(&AuthCaseCheckAdminInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&AuthCaseCheckAdminResponse{
		StatusCode: http.StatusOK,
		Data:       []IsAdmin{{authCaseAdminOutput.IsAdmin}},
		Message:    "Is admin",
	})
}

// ==================== Service ==========================

type AuthCaseCheckAdminInput struct {
	*AuthCaseCheckAdminRequest
}

type AuthCaseCheckAdminOutput struct {
	IsAdmin bool
}

func (service *serviceStruct) AuthCaseCheckAdmin(in *AuthCaseCheckAdminInput) (*AuthCaseCheckAdminOutput, error) {
	authEmailPassword, err := service.loginStorage.AdminAuthEmailPasswordGet(in.Email)
	if err != nil {
		return nil, err
	}

	isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)
	if !isMatched {
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	//isAdmin := false
	//roles, err := service.loginStorage.UserCaseGetUserRoles(user.Id)
	//if err != nil {
	//	return nil, err
	//}
	//if slices.Contains(roles, int(constant.Admin)) {
	//	isAdmin = true
	//}

	return &AuthCaseCheckAdminOutput{IsAdmin: true}, nil
}
