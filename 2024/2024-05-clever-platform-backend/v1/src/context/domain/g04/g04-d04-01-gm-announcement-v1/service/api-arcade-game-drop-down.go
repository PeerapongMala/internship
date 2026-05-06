package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
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
			Page:       pagination.Page,
			Limit:      pagination.Limit,
			TotalCount: totalCount,
		},
		Data:    response,
		Message: "Data retrived",
	})
}
func (service *serviceStruct) ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameList, int, error) {
	response, totalCount, err := service.GmannounceStorage.ArcadeGameList(pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	return response, totalCount, err
}
