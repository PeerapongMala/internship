package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) ArcadeGameList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	response, totalCount, err := api.Service.ArcadeGameList(pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    totalCount,
		},
		Data:    response,
		Message: "Data retrived",
	})
}
func (service *serviceStruct) ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameResponse, int, error) {
	response, totalCount, err := service.arcadeGameStorage.ArcadeGameList(pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	for i, v := range response {
		if response[i].ImageUrl != "" {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(v.ImageUrl)
			if err != nil {
				return nil, 0, err
			}
			response[i].ImageUrl = *url

		}
	}
	return response, totalCount, nil
}
