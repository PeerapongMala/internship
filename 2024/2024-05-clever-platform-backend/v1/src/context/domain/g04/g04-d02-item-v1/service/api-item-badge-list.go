package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) ListItemBadges(context *fiber.Ctx) error {
	log.Printf(">>> log <<<<")
	pagination := helper.PaginationNew(context)
	filter := constant.ItemListFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, err := api.Service.ListItemBadges(pagination, filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(ItemListResponse[[]constant.ItemAndBadgeResponse]{
		Data:       *response,
		Message:    "success",
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
	})

}

func (service *serviceStruct) ListItemBadges(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemAndBadgeResponse, error) {
	badges, err := service.itemStorage.ListItemBadges(pagination, filter)
	if err != nil {
		return nil, err
	}

	for i, badge := range *badges {
		if badge.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*badge.ImageUrl)
			if err != nil {
				return nil, err
			}
			badgeList := *badges
			badgeList[i].ImageUrl = url
		}
	}

	return badges, nil
}
