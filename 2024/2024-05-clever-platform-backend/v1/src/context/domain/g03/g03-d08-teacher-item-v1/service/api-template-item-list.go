package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TemplateItemListRequest struct {
	Type string `query:"type"`
}

type TemplateItemListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"_pagination"`
	Data       []constant.TemplateItemEntity `json:"data"`
	Message    string                        `json:"message"`
}

func (api *APIStruct) TemplateItemList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TemplateItemListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)
	templateItemListOutput, err := api.Service.TemplateItemList(&TemplateItemListInput{
		Pagination:              pagination,
		TemplateItemListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TemplateItemListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       templateItemListOutput.Items,
		Message:    "Data retrieved",
	})
}

type TemplateItemListInput struct {
	Pagination *helper.Pagination
	*TemplateItemListRequest
}
type TemplateItemListOutput struct {
	Items []constant.TemplateItemEntity
}

func (service *serviceStruct) TemplateItemList(in *TemplateItemListInput) (*TemplateItemListOutput, error) {
	items, err := service.teacherItemStorage.TemplateItemList(in.Pagination, in.Type)
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

	return &TemplateItemListOutput{
		items,
	}, nil
}
