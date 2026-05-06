package service

import (
	"encoding/json"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateShopItem(context *fiber.Ctx) error {
	storeItemId, err := context.ParamsInt("storeItemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	var requestBody map[string]interface{}

	if err := json.Unmarshal(context.Body(), &requestBody); err != nil {
		return helper.RespondHttpError(context, err)
	}

	if openDate, ok := requestBody["open_date"].(string); ok {
		parsedTime, err := helper.ConvertTimeStringToTime(openDate)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		requestBody["open_date"] = parsedTime
	} else {
		requestBody["open_date"] = nil
	}

	if closeDate, ok := requestBody["closed_date"].(string); ok {
		parsedTime, err := helper.ConvertTimeStringToTime(closeDate)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		requestBody["closed_date"] = parsedTime
	} else {
		requestBody["closed_date"] = nil
	}

	modifiedBody, _ := json.Marshal(requestBody)
	context.Request().SetBody(modifiedBody)

	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	adminId := context.Locals("subjectId").(string)
	request.UpdatedBy = &adminId

	response, err := api.Service.UpdateShopItem(storeItemId, *request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemShopResponse[constant.ShopItemEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})

}

func (service *serviceStruct) UpdateShopItem(storeItemId int, c constant.ShopItemRequest) (r constant.ShopItemEntity, err error) {
	return service.shopStorage.UpdateShopItem(storeItemId, c)
}
