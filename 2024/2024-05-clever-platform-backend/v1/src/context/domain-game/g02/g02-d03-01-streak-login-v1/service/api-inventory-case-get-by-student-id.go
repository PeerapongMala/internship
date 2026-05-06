package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type DataGetResponseInventory struct {
	Data    constant.InventoryEntity `json:"data"`
	Message string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) InventoryGetByStudentId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	inventory, err := api.Service.InventoryGetByStudentId(studentId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(DataGetResponseInventory{
		Data:    *inventory,
		Message: "Success",
	})

}

// ==================== Service ==========================

func (service *serviceStruct) InventoryGetByStudentId(studentId string) (*constant.InventoryEntity, error) {
	inventory, err := service.subjectCheckinStorage.GetInventoryByStudentId(studentId)
	if err != nil {
		return nil, err
	}

	return inventory, nil
}
