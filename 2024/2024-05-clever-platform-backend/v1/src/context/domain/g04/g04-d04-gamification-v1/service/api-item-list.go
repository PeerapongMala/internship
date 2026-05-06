package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

type ItemListRequest struct {
	constant.ItemFilter
}

// ==================== Response ==========================

type ItemListResponse struct {
	StatusCode int                   `json:"status_code"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.ItemEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ItemList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ItemListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	itemListOutput, err := api.Service.ItemList(&ItemListInput{
		Pagination:      pagination,
		ItemListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ItemListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       itemListOutput.Items,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ItemListInput struct {
	Pagination *helper.Pagination
	*ItemListRequest
}

type ItemListOutput struct {
	Items []constant.ItemEntity
}

func (service *serviceStruct) ItemList(in *ItemListInput) (*ItemListOutput, error) {
	items, err := service.gamificationStorage.ItemList(&in.ItemFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, item := range items {
		if item.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*item.ImageUrl)
			if err != nil {
				return nil, err
			}
			items[i].ImageUrl = url
		}
	}

	return &ItemListOutput{
		items,
	}, nil
}
