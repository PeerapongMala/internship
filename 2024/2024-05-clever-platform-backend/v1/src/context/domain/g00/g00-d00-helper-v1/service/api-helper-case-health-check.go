package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type HelperCaseHealthCheckResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.HealthData `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) HelperCaseHealthCheck(context *fiber.Ctx) error {
	helperCaseHealCheckOutput, err := api.Service.HelperCaseHealthCheck()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(HelperCaseHealthCheckResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.HealthData{*helperCaseHealCheckOutput.HealthData},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type HelperCaseHealthCheckOutput struct {
	HealthData *constant.HealthData `json:"health_data"`
}

func (service *serviceStruct) HelperCaseHealthCheck() (*HelperCaseHealthCheckOutput, error) {
	health, err := service.helperStorage.HelperCaseHealthCheck()
	if err != nil {
		return nil, err
	}
	return &HelperCaseHealthCheckOutput{
		HealthData: &constant.HealthData{
			Data: map[string]bool{"health": health},
		},
	}, nil
}
