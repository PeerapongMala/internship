package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type TeacherCaseUpdatePasswordRequest struct {
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type TeacherCaseUpdatePasswordResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCaseUpdatePassword(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherCaseUpdatePasswordRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.TeacherCaseUpdatePassword(&TeacherCaseUpdatePasswordInput{
		UserId:   subjectId,
		Password: request.Password,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCaseUpdatePasswordResponse{
		StatusCode: http.StatusOK,
		Message:    "Password updated",
	})
}

// ==================== Service ==========================

type TeacherCaseUpdatePasswordInput struct {
	UserId   string
	Password string
}

func (service *serviceStruct) TeacherCaseUpdatePassword(in *TeacherCaseUpdatePasswordInput) error {
	passwordHash, err := helper.HashAndSalt(in.Password)
	if err != nil {
		return err
	}

	err = service.teacherProfileStorage.AuthCaseUpdatePassword(in.UserId, *passwordHash)
	if err != nil {
		return err
	}

	return nil
}
