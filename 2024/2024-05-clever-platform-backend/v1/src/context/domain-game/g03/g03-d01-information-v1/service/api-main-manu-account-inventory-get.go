package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================

type AccountInventoryRequest struct {
	SubjectId int `query:"subject_id"`
}
type AccountInventoryResponse struct {
	Data *constant.InventoryEntity `json:"data"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) MainManuAccountInventoryGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AccountInventoryRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	inventory, err := api.Service.MainManuAccountInventoryGet(userId, request.SubjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(inventory)
}

// ==================== Service ==========================
func (service *serviceStruct) MainManuAccountInventoryGet(userId string, subjectId int) (*AccountInventoryResponse, error) {
	inventory, err := service.informationStorage.GetInventoryInfoByUserId(userId)
	if err != nil {
		return nil, err
	}

	stars, err := service.informationStorage.GetStars(userId, subjectId)
	if err != nil {
		return nil, err
	}
	inventory.Stars = stars

	return &AccountInventoryResponse{
		Data: inventory,
	}, nil
}
