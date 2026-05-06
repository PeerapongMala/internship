package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ItemListResponse[T any] struct {
	Pagination *helper.Pagination `json:"_pagination"`
	StatusCode int                `json:"status_code"`
	Data       T                  `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.ItemListFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	response, err := api.Service.ItemList(pagination, filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemListResponse[[]constant.ItemResponse]{
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
		Data:       *response,
		Message:    "Item list",
	})

}

// ==================== Service ==========================

func (service *serviceStruct) ItemList(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemResponse, error) {
	item, err := service.itemStorage.ListItem(pagination, filter)
	if err != nil {
		return nil, err
	}

	for i, it := range *item {
		if it.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*it.ImageUrl)
			if err != nil {
				return nil, err
			}
			itemList := *item
			itemList[i].ImageUrl = url
		}
	}

	return item, nil
}
