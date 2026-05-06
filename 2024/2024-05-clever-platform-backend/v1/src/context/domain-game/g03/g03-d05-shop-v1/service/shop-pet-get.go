package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetShopPet(context *fiber.Ctx) error {
	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	petId, err := context.ParamsInt("petId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	response, err := api.Service.GetShopPet(studentId, petId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopPetResponse]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})
}

func (service *serviceStruct) GetShopPet(studentId string, petId int) (r constant.ShopPetResponse, err error) {
	return service.shopStorage.GetShopPet(studentId, petId)
}
