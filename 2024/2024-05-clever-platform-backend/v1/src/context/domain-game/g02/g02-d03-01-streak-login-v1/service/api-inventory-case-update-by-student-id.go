package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
)

// ==================== Request ==========================

type InventoryUpdateRequesty struct {
	Id         *int    `json:"id"`
	StudentId  *string `json:"student_id" validate:"required"`
	GoldCoin   *int    `json:"gold_coin"`
	ArcadeCoin *int    `json:"arcade_coin"`
	Ice        *int    `json:"ice"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) InventoryUpdateByStudentId(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &InventoryUpdateRequesty{})
	// log.Println("request", request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	inventory := &constant.InventoryEntity{}
	copier.Copy(inventory, request)

	response, err := api.Service.InventoryUpdateByStudentId(inventory)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(DataGetResponseInventory{
		Data:    *response,
		Message: "Success",
	})

}

// ==================== Service ==========================

func (service *serviceStruct) InventoryUpdateByStudentId(request *constant.InventoryEntity) (*constant.InventoryEntity, error) {
	inventory, err := service.subjectCheckinStorage.UpdateInventoryByStudentId(request)
	if err != nil {
		return nil, err
	}

	return inventory, nil
}
