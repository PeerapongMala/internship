package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SchoolContractsList(context *fiber.Ctx) error {
	filter := constant.FilterSchoolContract{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	pagination := helper.PaginationNew(context)
	SchoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	responses, totalCount, err := api.Service.GetSchoolContracts(SchoolId, filter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    totalCount,
		},
		Data:    responses,
		Message: "Data retrived",
	})
}
func (service *serviceStruct) GetSchoolContracts(SchoolId int, filter constant.FilterSchoolContract, pagination *helper.Pagination) ([]constant.SchoolContractsResponse, int, error) {
	response, totalCount, err := service.adminSchoolStorage.GetSchoolContracts(SchoolId, filter, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	return response, totalCount, nil
}
