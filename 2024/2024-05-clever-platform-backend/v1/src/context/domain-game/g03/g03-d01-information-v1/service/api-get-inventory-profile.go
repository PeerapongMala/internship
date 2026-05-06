package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) GetInventoryProfile(context *fiber.Ctx) error {
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	inventory, err := api.Service.GetInventoryProfile(userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       inventory,
		Message:    "Data Retrieve",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GetInventoryProfile(userId string) (*constant.InventoryProfile, error) {
	inventory, err := service.informationStorage.GetInventoryProfile(userId)
	if err != nil {
		return nil, err
	}

	return inventory, nil
}
