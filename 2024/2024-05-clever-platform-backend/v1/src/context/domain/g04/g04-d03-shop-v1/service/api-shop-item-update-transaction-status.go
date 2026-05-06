package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateShopItemTransactionStatus(context *fiber.Ctx) error {

	transactionId, err := context.ParamsInt("transactionId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemTransactionStatusRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	response, err := api.Service.UpdateShopItemTransactionStatus(transactionId, *request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopItemTransactionEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})

}

func (service *serviceStruct) UpdateShopItemTransactionStatus(transactionId int, c constant.ShopItemTransactionStatusRequest) (r constant.ShopItemTransactionEntity, err error) {
	return service.shopStorage.UpdateShopItemTransactionStatus(transactionId, c)
}
