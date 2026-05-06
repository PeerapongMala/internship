package service

import (
	"database/sql"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthEmailPasswordUpdateRequest struct {
	UserId   string `json:"user_id" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type AuthEmailPasswordUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthEmailPasswordUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthEmailPasswordUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AuthEmailPasswordUpdate(&AuthEmailPasswordUpdateInput{
		AuthEmailPasswordUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthEmailPasswordUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Password updated",
	})
}

// ==================== Service ==========================

type AuthEmailPasswordUpdateInput struct {
	*AuthEmailPasswordUpdateRequest
}

func (service *serviceStruct) AuthEmailPasswordUpdate(in *AuthEmailPasswordUpdateInput) error {
	authEmailPassword, err := service.adminUserAccountStorage.AuthEmailPasswordGet(in.UserId)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	passwordHash, err := helper.HashAndSalt(in.Password)
	if err != nil {
		return err
	}
	if authEmailPassword != nil {
		err = service.adminUserAccountStorage.AuthEmailPasswordUpdate(&constant.AuthEmailPasswordEntity{
			UserId:       in.UserId,
			PasswordHash: *passwordHash,
		})
		if err != nil {
			return err
		}
	} else {
		_, err = service.adminUserAccountStorage.AuthEmailPasswordCreate(nil, &constant.AuthEmailPasswordEntity{
			UserId:       in.UserId,
			PasswordHash: *passwordHash,
		})
	}

	return nil
}
