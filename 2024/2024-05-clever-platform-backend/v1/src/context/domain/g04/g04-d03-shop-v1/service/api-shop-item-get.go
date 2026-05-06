package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetShopItem(context *fiber.Ctx) error {

	storeItemId, err := context.ParamsInt("storeItemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.GetShopItem(storeItemId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopItemResponse]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) GetShopItem(storeItemId int) (r constant.ShopItemResponse, err error) {
	return service.shopStorage.GetShopItem(storeItemId)
}
