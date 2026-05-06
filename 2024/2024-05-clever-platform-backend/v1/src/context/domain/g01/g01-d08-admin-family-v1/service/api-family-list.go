package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) FamilyList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	filter, err := helper.ParseAndValidateRequest(context, &constant.FamilyFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.FamilyList(filter, pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) FamilyList(filter *constant.FamilyFilter, pagination *helper.Pagination) ([]*constant.FamilyResponse, error) {
	family, err := service.adminFamilyStorage.FamilyList(filter, pagination)
	if err != nil {
		return nil, err
	}
	return family, nil
}
