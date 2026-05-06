package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type UserGetResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []UserGetData `json:"data"`
	Message    string        `json:"message"`
}

type UserGetData struct {
	*constant.UserEntity
	Roles []int `json:"roles"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserGet(context *fiber.Ctx) error {
	userId := context.Params("userId")
	user, roles, err := api.Service.UserGet(userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UserGetResponse{
		StatusCode: http.StatusOK,
		Data: []UserGetData{{
			UserEntity: user,
			Roles:      roles,
		}},
		Message: "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) UserGet(userId string) (*constant.UserEntity, []int, error) {
	user, err := service.adminUserAccountStorage.UserGet(userId)
	if err != nil {
		return nil, nil, err
	}

	roles, err := service.adminUserAccountStorage.UserCaseGetUserRole(userId)
	if err != nil {
		return nil, nil, err
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, nil, err
		}
		user.ImageUrl = url
	}

	return user, roles, nil
}
