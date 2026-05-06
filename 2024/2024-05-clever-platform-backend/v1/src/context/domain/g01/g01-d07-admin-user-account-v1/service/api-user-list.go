package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type UserListResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.UserWithRolesEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	userFilter := constant.UserFilter{}
	err := context.QueryParser(&userFilter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	lastLoginString := context.Query("last_login")
	lastLogin, err := time.Parse(time.RFC3339Nano, context.Query("last_login"))
	if err != nil && lastLoginString != "" {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	userFilter.LastLogin = lastLogin

	users, err := api.Service.UserList(&userFilter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UserListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       users,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) UserList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.UserWithRolesEntity, error) {
	users, err := service.adminUserAccountStorage.UserList(filter, pagination)
	if err != nil {
		return nil, err
	}

	return users, nil
}
