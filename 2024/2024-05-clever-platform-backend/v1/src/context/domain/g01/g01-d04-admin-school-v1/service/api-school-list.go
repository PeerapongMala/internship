package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SchoolList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.SchoolListFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	response, err := api.Service.SchoolList(filter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    pagination.TotalCount,
		},
		Data:    response,
		Message: "Data retrived",
	})
}
func (service *serviceStruct) SchoolList(filter constant.SchoolListFilter, pagination *helper.Pagination) ([]constant.SchoolListResponse, error) {
	response, err := service.adminSchoolStorage.SchoolList(filter, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return response, nil
}
