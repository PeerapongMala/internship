package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) ParentList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	search := context.Query("search")

	data, err := api.Service.ParentList(search, pagination)
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

func (service *serviceStruct) ParentList(search string, pagination *helper.Pagination) ([]*constant.Parent, error) {
	parents, err := service.adminFamilyStorage.ParentList(search, pagination)
	if err != nil {
		return nil, err
	}
	return parents, nil
}
