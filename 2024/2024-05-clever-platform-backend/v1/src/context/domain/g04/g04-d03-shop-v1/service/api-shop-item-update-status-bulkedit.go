package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"

	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateShopItemStatusBulkEdit(context *fiber.Ctx) error {

	updateBy, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	var request constant.ShopItemStatusBulkEditRequest
	body, err := helper.ParseAndValidateRequest(context, &request, helper.ParseOptions{
		Body: true,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.UpdateShopItemStatusBulkEdit(*body, updateBy)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[[]constant.ShopItemEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) UpdateShopItemStatusBulkEdit(c constant.ShopItemStatusBulkEditRequest, updateBy string) (r []constant.ShopItemEntity, err error) {
	return service.shopStorage.UpdateShopItemStatusBulkEdit(c.Items, updateBy)
}
