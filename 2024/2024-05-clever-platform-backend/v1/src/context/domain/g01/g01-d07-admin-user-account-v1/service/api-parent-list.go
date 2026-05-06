package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) ParentList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	userFilter := constant.UserFilter{}
	err := context.QueryParser(&userFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	parentList, err := api.Service.ParentList(&userFilter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if parentList == nil {
		parentList = []constant.ParentDataEntity{}
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       parentList,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (serviceStruct *serviceStruct) ParentList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.ParentDataEntity, error) {
	parentList, err := serviceStruct.adminUserAccountStorage.ParentList(filter, pagination)
	if err != nil {
		return nil, err
	}

	return parentList, nil
}
