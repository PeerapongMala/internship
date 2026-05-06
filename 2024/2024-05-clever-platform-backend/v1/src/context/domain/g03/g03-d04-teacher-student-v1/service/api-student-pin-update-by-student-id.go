package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type TeacherStudentPinUpdateRequest struct {
	NewPin string `json:"new_pin" validate:"required"`
}

type TeacherStudentPinUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func (api *APIStruct) StudentPinUpdateByStudentId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	request, err := helper.ParseAndValidateRequest(context, &TeacherStudentPinUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if err := api.Service.StudentPinUpdateByStudentId(studentId, request.NewPin); err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(TeacherStudentPinUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
	})
}

func (service *serviceStruct) StudentPinUpdateByStudentId(studentId string, newPin string) error {
	err := service.repositoryStorageAuth.AuthCaseUpdatePin(studentId, newPin)
	if err != nil {
		return err
	}

	return nil
}
