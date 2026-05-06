package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) UpdateStatus(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.Config{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.UpdateStatus(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Update Success",
	})
}

func (service *serviceStruct) UpdateStatus(req *constant.Config) error {
	err := service.chatConfigStorage.UpdateStatus(req)
	if err != nil {
		return err
	}
	return nil
}
