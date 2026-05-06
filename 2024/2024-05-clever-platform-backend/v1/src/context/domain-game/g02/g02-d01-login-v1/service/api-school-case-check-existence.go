package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SchoolCaseCheckExistenceRequest struct {
	SchoolCode string `query:"school_code" validate:"required"`
}

// ==================== Response ==========================

type SchoolCaseCheckExistenceResponse struct {
	StatusCode int               `json:"status_code"`
	Data       []SchoolExistence `json:"data"`
	Message    string            `json:"message"`
}

type SchoolExistence struct {
	IsExists *bool `json:"is_exists"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolCaseCheckExistence(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolCaseCheckExistenceRequest{}, helper.ParseOptions{
		Query: true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	schoolCaseCheckExistenceOutput, err := api.Service.SchoolCaseCheckExistence(&SchoolCaseCheckExistenceInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SchoolCaseCheckExistenceResponse{
		StatusCode: http.StatusOK,
		Data:       []SchoolExistence{{schoolCaseCheckExistenceOutput.IsExists}},
		Message:    "Exists",
	})
}

// ==================== Service ==========================

type SchoolCaseCheckExistenceInput struct {
	*SchoolCaseCheckExistenceRequest
}

type SchoolCaseCheckExistenceOutput struct {
	IsExists *bool
}

func (service *serviceStruct) SchoolCaseCheckExistence(in *SchoolCaseCheckExistenceInput) (*SchoolCaseCheckExistenceOutput, error) {
	isExists, err := service.loginStorage.SchoolCaseCheckExistence(in.SchoolCode)
	if err != nil {
		return nil, err
	}

	return &SchoolCaseCheckExistenceOutput{IsExists: isExists}, nil
}
