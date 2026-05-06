package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthCaseUpdatePasswordRequest struct {
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type AuthCaseUpdatePasswordResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ContentCreatorCaseUpdatePassword(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthCaseUpdatePasswordRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ContentCreatorCaseUpdatePassword(&AuthCaseUpdatePasswordInput{
		UserId:   subjectId,
		Password: request.Password,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(
		AuthCaseUpdatePasswordResponse{
			StatusCode: http.StatusOK,
			Message:    "Password updated",
		},
	)
}

// ==================== Service ==========================

type AuthCaseUpdatePasswordInput struct {
	UserId   string
	Password string
}

func (service *serviceStruct) ContentCreatorCaseUpdatePassword(in *AuthCaseUpdatePasswordInput) error {
	passwordHash, err := helper.HashAndSalt(in.Password)
	if err != nil {
		return err
	}

	err = service.academicProfileStorage.AuthCaseUpdatePassword(in.UserId, *passwordHash)
	if err != nil {
		return err
	}

	return nil
}
