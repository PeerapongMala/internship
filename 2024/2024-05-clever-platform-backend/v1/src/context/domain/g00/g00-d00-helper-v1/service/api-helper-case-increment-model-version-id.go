package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type HelperCaseIncrementModelVersionIdResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) HelperCaseIncrementModelVersionId(context *fiber.Ctx) error {
	err := api.Service.HelperCaseIncrementModelVersionId()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(HelperCaseIncrementModelVersionIdResponse{
		StatusCode: http.StatusOK,
		Message:    "Version Updated",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) HelperCaseIncrementModelVersionId() error {
	err := service.helperStorage.HelperCaseIncrementVersionId()
	if err != nil {
		return err
	}
	return nil
}
