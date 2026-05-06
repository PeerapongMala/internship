package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) AddShopItem(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.StudentId = studentId
	response, err := api.Service.AddShopItem(*request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopItemResponse]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})

}

func (service *serviceStruct) AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error) {
	return service.shopStorage.AddShopItem(c)
}
