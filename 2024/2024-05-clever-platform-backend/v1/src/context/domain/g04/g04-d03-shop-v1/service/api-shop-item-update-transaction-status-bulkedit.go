package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateShopItemTransactionStatusBulkEdit(context *fiber.Ctx) error {

	var request constant.ShopItemTransactionStatusBulkEditRequest
	body, err := helper.ParseAndValidateRequest(context, &request, helper.ParseOptions{
		Body: true,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.UpdateShopItemTransactionStatusBulkEdit(*body)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[[]constant.ShopItemTransactionEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) UpdateShopItemTransactionStatusBulkEdit(c constant.ShopItemTransactionStatusBulkEditRequest) (r []constant.ShopItemTransactionEntity, err error) {
	return service.shopStorage.UpdateShopItemTransactionStatusBulkEdit(c.Items)
}
