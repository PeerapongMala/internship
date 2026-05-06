package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type IndicatorGetResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.IndicatorEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) IndicatorGet(context *fiber.Ctx) error {
	indicatorId, err := context.ParamsInt("indicatorId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	indicatorGetOutput, err := api.Service.IndicatorGet(&IndicatorGetInput{
		IndicatorId: indicatorId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(IndicatorGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.IndicatorEntity{*indicatorGetOutput.IndicatorEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type IndicatorGetInput struct {
	IndicatorId int
}

type IndicatorGetOutput struct {
	*constant.IndicatorEntity
}

func (service *serviceStruct) IndicatorGet(in *IndicatorGetInput) (*IndicatorGetOutput, error) {
	indicator, err := service.repositoryStorage.IndicatorGet(in.IndicatorId)
	if err != nil {
		return nil, err
	}

	return &IndicatorGetOutput{
		indicator,
	}, nil
}
