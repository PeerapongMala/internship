package service

import (
	"database/sql"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type AuthPinUpdateRequest struct {
	UserId string `json:"user_id" validate:"required"`
	Pin    string `json:"pin" validate:"required"`
}

// ==================== Response ==========================

type AuthPinUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AuthPinUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AuthPinUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AuthPinUpdate(&AuthPinUpdateInput{
		AuthPinUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AuthPinUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Pin updated",
	})
}

// ==================== Service ==========================

type AuthPinUpdateInput struct {
	*AuthPinUpdateRequest
}

func (service *serviceStruct) AuthPinUpdate(in *AuthPinUpdateInput) error {
	_, err := service.adminSchoolStorage.StudentGet(in.UserId)
	if err != nil {
		return err
	}

	authPin, err := service.adminSchoolStorage.AuthPinGet(in.UserId)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	newAuthPin := constant.AuthPinEntity{
		UserId: in.UserId,
		Pin:    in.Pin,
	}
	if authPin != nil {
		err = service.adminSchoolStorage.AuthPinUpdate(nil, &newAuthPin)
		if err != nil {
			return err
		}
	} else {
		_, err := service.adminSchoolStorage.AuthPinCreate(nil, &newAuthPin)
		if err != nil {
			return err
		}
	}

	return nil
}
