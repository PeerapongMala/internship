package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SchoolAffiliationList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.SchoolAffiliationFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	response, _, err := api.Service.SchoolAffiliationList(filter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: pagination,
		Data:       response,
		Message:    "Data retrived",
	})
}
func (service *serviceStruct) SchoolAffiliationList(filter constant.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant.SchoolAffiliationList, int, error) {
	response, totalCount, err := service.adminSchoolStorage.SchoolAffiliationList(filter, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	return response, totalCount, nil
}
