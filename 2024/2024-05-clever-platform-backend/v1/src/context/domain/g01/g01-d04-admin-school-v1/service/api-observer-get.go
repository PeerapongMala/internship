package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ObserverGetResponse struct {
	StatusCode int               `json:"status_code"`
	Data       []ObserverGetData `json:"data"`
	Message    string            `json:"message"`
}

type ObserverGetData struct {
	*constant.UserEntity
	ObserverAccesses []constant.ObserverAccessEntity `json:"observer_accesses"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverGet(context *fiber.Ctx) error {
	userId := context.Params("userId")

	observerGetOutput, err := api.Service.ObserverGet(&ObserverGetInput{
		UserId: userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverGetResponse{
		StatusCode: http.StatusOK,
		Data: []ObserverGetData{{
			UserEntity:       observerGetOutput.UserEntity,
			ObserverAccesses: observerGetOutput.ObserverAccesses,
		}},
		Message: "Data retrieved",
	})
}

// ==================== Service ==========================

type ObserverGetInput struct {
	UserId string
}

type ObserverGetOutput struct {
	*constant.UserEntity
	ObserverAccesses []constant.ObserverAccessEntity
}

func (service *serviceStruct) ObserverGet(in *ObserverGetInput) (*ObserverGetOutput, error) {
	observerAccesses, err := service.adminSchoolStorage.ObserverCaseGetObserverAccesses(in.UserId)
	if err != nil {
		return nil, err
	}

	user, err := service.adminSchoolStorage.UserGet(in.UserId)
	if err != nil {
		return nil, err
	}

	roles, err := service.adminSchoolStorage.UserCaseGetUserRole(user.Id)
	if err != nil {
		return nil, err
	}

	if !slices.Contains(roles, int(constant.Observer)) {
		return nil, helper.NewHttpError(http.StatusNotFound, nil)
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, err
		}
		user.ImageUrl = url
	}

	return &ObserverGetOutput{
		ObserverAccesses: observerAccesses,
		UserEntity:       user,
	}, nil
}
