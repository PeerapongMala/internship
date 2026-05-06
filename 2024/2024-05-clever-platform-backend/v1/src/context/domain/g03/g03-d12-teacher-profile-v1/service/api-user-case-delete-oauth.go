package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Request ==========================

type UserCaseDeleteOauthRequest struct {
	Provider string `json:"provider" validate:"required"`
}

// ==================== Response ==========================

type UserCaseDeleteOauthResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserCaseDeleteOauth(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &UserCaseDeleteOauthRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.UserCaseDeleteOauth(&UserCaseDeleteOauthInput{
		UserId:                     subjectId,
		UserCaseDeleteOauthRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UserCaseDeleteOauthResponse{
		StatusCode: http.StatusOK,
		Message:    "Deleted",
	})
}

// ==================== Service ==========================

type UserCaseDeleteOauthInput struct {
	UserId string
	*UserCaseDeleteOauthRequest
}

func (service *serviceStruct) UserCaseDeleteOauth(in *UserCaseDeleteOauthInput) error {
	err := service.teacherProfileStorage.UserCaseDeleteOauth(in.UserId, in.Provider)
	if err != nil {
		return err
	}

	return nil
}
