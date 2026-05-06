package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d10-settings-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ========================
type Pin struct {
	Pin string `params:"pin"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) ChangePin(context *fiber.Ctx) error {
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	req, err := helper.ParseAndValidateRequest(context, &Pin{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.ChangePin(userId, req.Pin)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: http.StatusOK,
		Message:    "Change pin success",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) ChangePin(userID string, pin string) error {

	if len(pin) != 4 {
		return errors.New("The number of pins must equal 4.")
	}

	err := service.settingsStorage.ChangePin(userID, pin)
	if err != nil {
		return err
	}
	return nil
}
