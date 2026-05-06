package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetShopAvatar(context *fiber.Ctx) error {
	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	avatarId, err := context.ParamsInt("avatarId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.GetShopAvatar(studentId, avatarId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopResponse]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) GetShopAvatar(studentId string, avatarId int) (r constant.ShopResponse, err error) {
	return service.shopStorage.GetShopAvatar(studentId, avatarId)
}
