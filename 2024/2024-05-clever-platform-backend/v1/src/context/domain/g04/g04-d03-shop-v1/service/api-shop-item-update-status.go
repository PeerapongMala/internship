package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateShopItemStatus(context *fiber.Ctx) error {

	storeItemId, err := context.ParamsInt("storeItemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemStatusRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	response, err := api.Service.UpdateShopItemStatus(storeItemId, *request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopItemEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})

}

func (service *serviceStruct) UpdateShopItemStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error) {
	return service.shopStorage.UpdateShopItemStatus(storeItemId, c)
}
