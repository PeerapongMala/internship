package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetShopItemLists(context *fiber.Ctx) error {

	pagination := helper.PaginationNew(context)
	filter := constant.ShopItemListFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	response, err := api.Service.GetShopItemLists(pagination, &filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopListsResponse[[]constant.ShopItemResponse]{
		Data:       response,
		Message:    "success",
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) GetShopItemLists(pagination *helper.Pagination, filter *constant.ShopItemListFilter) (r []constant.ShopItemResponse, err error) {
	return service.shopStorage.GetShopItemLists(pagination, filter)
}
