package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) ProvinceList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	response, totalCount, err := api.Service.ProvinceList(pagination)
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
func (service *serviceStruct) ProvinceList(pagination *helper.Pagination) ([]constant.ProvinceList, int, error) {
	response, totalCount, err := service.adminSchoolStorage.ProvinceList(pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	return response, totalCount, nil
}
