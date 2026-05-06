package service

import (
	"encoding/json"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) AddShopItem(context *fiber.Ctx) error {
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
	}

	if closedDate, ok := requestBody["closed_date"].(string); ok {
		parsedTime, err := helper.ConvertTimeStringToTime(closedDate)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		requestBody["closed_date"] = parsedTime
	}

	modifiedBody, _ := json.Marshal(requestBody)
	context.Request().SetBody(modifiedBody)

	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	adminId := context.Locals("subjectId").(string)
	request.CreatedBy = &adminId
	response, err := api.Service.AddShopItem(*request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusCreated).JSON(ItemShopResponse[constant.ShopItemEntity]{
		Data:       response,
		Message:    "success",
		StatusCode: fiber.StatusCreated,
	})

}

func (service *serviceStruct) AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemEntity, err error) {
	if c.OpenDate == nil {
		now := time.Now().UTC()
		c.OpenDate = &now
	}
	return service.shopStorage.AddShopItem(c)
}
