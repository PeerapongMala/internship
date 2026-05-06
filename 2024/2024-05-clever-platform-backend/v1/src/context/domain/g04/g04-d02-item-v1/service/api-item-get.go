package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================

type ItemGetResponse struct {
	Data       constant.ItemResponse `json:"data"`
	Message    string                `json:"message"`
	StatusCode int                   `json:"status_code"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemGet(context *fiber.Ctx) error {
	itemId, err := context.ParamsInt("itemId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	response, err := api.Service.ItemGet(itemId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemGetResponse{
		Data:       *response,
		Message:    "success",
		StatusCode: fiber.StatusOK,
	})

}

// ==================== Service ==========================

func (service *serviceStruct) ItemGet(itemId int) (*constant.ItemResponse, error) {
	item, err := service.itemStorage.GetItem(itemId)
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
