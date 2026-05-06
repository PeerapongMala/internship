package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type TosCaseCheckAcceptanceRequest struct {
	TosId int `params:"tosId" validate:"required"`
}

// ==================== Response ==========================

type TosCaseCheckAcceptanceResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []bool `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TosCaseCheckAcceptance(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TosCaseCheckAcceptanceRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		msg := "Failed to retrieve subjectId from context"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &msg))
	}

	tosCaseCheckAcceptanceOutput, err := api.Service.TosCaseCheckAcceptance(&TosCaseCheckAcceptanceInput{
		SubjectId:                     subjectId,
		TosCaseCheckAcceptanceRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TosCaseCheckAcceptanceResponse{
		StatusCode: http.StatusOK,
		Data:       []bool{*tosCaseCheckAcceptanceOutput.IsExists},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TosCaseCheckAcceptanceInput struct {
	SubjectId string
	*TosCaseCheckAcceptanceRequest
}

type TosCaseCheckAcceptanceOutput struct {
	IsExists *bool
}

func (service *serviceStruct) TosCaseCheckAcceptance(in *TosCaseCheckAcceptanceInput) (*TosCaseCheckAcceptanceOutput, error) {
	isExists, err := service.termsStorage.TosAcceptanceGet(in.TosId, in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &TosCaseCheckAcceptanceOutput{IsExists: isExists}, nil
}
