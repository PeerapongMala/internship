package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type UseItemRequest struct {
	SubjectId      int  `json:"subject_id"`
	UseCoinFlag    bool `json:"use_coin_flag"`
	UseItemFlag    bool `json:"use_item_flag"`
	UserId         string
}

// ==================== Response ==========================
type UseItemResponse struct {
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) UseItem(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &UseItemRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	err = api.Service.UseItem(&UseItemInput{
		UseItemRequest: request,
	})

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		},
		)
	}

	return context.Status(http.StatusOK).JSON(UseItemResponse{
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "success",
		},
	})
}

type UseItemInput struct {
	*UseItemRequest
}

func (service *serviceStruct) UseItem(in *UseItemInput) error {

	if in.UseCoinFlag {
		// use coin
		service.subjectCheckinStorage.UpdateCoinInventory(&constant.InventoryDTO{
			StudentId: in.UserId,
			GoldCoin:  -10,
		})
	}

	if in.UseItemFlag {
		// TODO: use item
		service.subjectCheckinStorage.UpdateCoinInventory(&constant.InventoryDTO{
			StudentId: in.UserId,
			IceAmount:  -1,
		})
	}

	return nil

}
