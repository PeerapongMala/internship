package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
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

func (api *APIStruct) UserGet(context *fiber.Ctx) error {
	userId := context.Params("userId")
	userGetOutput, err := api.Service.UserGet(&UserGetInput{
		UserId: userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UserGetResponse{
		StatusCode: http.StatusOK,
		Data: []UserGetData{{
			UserEntity: userGetOutput.UserEntity,
			Roles:      userGetOutput.Roles,
		}},
		Message: "Data retrieved",
	})
}

// ==================== Service ==========================

type UserGetInput struct {
	UserId string
}

type UserGetOutput struct {
	*constant.UserEntity
	Roles []int
}

func (service *serviceStruct) UserGet(in *UserGetInput) (*UserGetOutput, error) {
	user, err := service.adminSchoolStorage.UserGet(in.UserId)
	if err != nil {
		return nil, err
	}

	roles, err := service.adminSchoolStorage.UserCaseGetUserRole(in.UserId)
	if err != nil {
		return nil, err
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, err
		}
		user.ImageUrl = url
	}

	return &UserGetOutput{
		UserEntity: user,
		Roles:      roles,
	}, nil
}
