package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================

type ItemBadgeGetResponse[T any] struct {
	Data       T      `json:"data"`
	Message    string `json:"message"`
	StatusCode int    `json:"status_code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemBadgeGet(context *fiber.Ctx) error {
	id, err := context.ParamsInt("itemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	response, err := api.Service.ItemBadgeGet(id)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemBadgeGetResponse[constant.ItemAndBadgeResponse]{
		Data:       *response,
		Message:    "Item badge",
		StatusCode: fiber.StatusOK,
	})
}

// ==================== Service ==========================

func (service *serviceStruct) ItemBadgeGet(id int) (*constant.ItemAndBadgeResponse, error) {
	item, err := service.itemStorage.GetItemBadge(id)
	if err != nil {
		return nil, err
	}

	if item.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*item.ImageUrl)
		if err != nil {
			return nil, err
		}
		item.ImageUrl = url
	}

	return item, nil
}
