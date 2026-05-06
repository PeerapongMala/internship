package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

)

// ==================== Response ==========================
type GoldCoinResponse struct {
	Data *constant.InventoryEntity `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) GetGoldCoin(context *fiber.Ctx) error {

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GetGoldCoin(userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GoldCoinResponse{
		Data: resp,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message: 	"Data retrieved",
		},
	})
}


func (service *serviceStruct) GetGoldCoin(id string) (*constant.InventoryEntity, error) {

	inventoryEntity, err := service.levelStorage.GetInventoryByStudentId(&id)
	if err != nil {
		return nil, err
	}

	return inventoryEntity, nil
}
