package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ObserverAccessGetRequest struct {
	Id *int `params:"observerAccessId" validate:"required"`
}

// ==================== Response ==========================

type ObserverAccessGetResponse struct {
	StatusCode int                             `json:"status_code"`
	Data       []constant.ObserverAccessEntity `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	observerAccessGetOutput, err := api.Service.ObserverAccessGet(&ObserverAccessGetInput{
		ObserverAccessId: request.Id,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&ObserverAccessGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.ObserverAccessEntity{*observerAccessGetOutput.ObserverAccessEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ObserverAccessGetInput struct {
	ObserverAccessId *int
}

type ObserverAccessGetOutput struct {
	*constant.ObserverAccessEntity
}

func (service *serviceStruct) ObserverAccessGet(in *ObserverAccessGetInput) (*ObserverAccessGetOutput, error) {
	observerAccess, err := service.adminReportPermissionStorage.ObserverAccessGet(in.ObserverAccessId)
	if err != nil {
		return nil, err
	}

	return &ObserverAccessGetOutput{
		observerAccess,
	}, nil
}
