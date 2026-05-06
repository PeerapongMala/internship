package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g01/g01-d02-terms-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type TosGetRequest struct {
	TosId int `params:"tosId" validate:"required"`
}

// ==================== Response ==========================

type TosGetResponse struct {
	StatusCode int                  `json:"status_code"`
	Data       []constant.TosEntity `json:"data"`
	Message    string               `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TosGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TosGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	tosGetOutput, err := api.Service.TosGet(&TosGetInput{
		Request: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TosGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.TosEntity{*tosGetOutput.TosEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TosGetInput struct {
	Request *TosGetRequest
}

type TosGetOutput struct {
	*constant.TosEntity
}

func (service *serviceStruct) TosGet(in *TosGetInput) (*TosGetOutput, error) {
	tos, err := service.termsStorage.TosGet(in.Request.TosId)
	if err != nil {
		return nil, err
	}

	return &TosGetOutput{tos}, nil
}
