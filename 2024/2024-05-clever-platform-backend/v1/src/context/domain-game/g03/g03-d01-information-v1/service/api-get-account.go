package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) GetAccount(context *fiber.Ctx) error {
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	account, err := api.Service.GetAccount(userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       account,
		Message:    "Data Retrieve",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GetAccount(userId string) (*constant.Account, error) {
	account, err := service.informationStorage.GetAccount(userId)
	if err != nil {
		return nil, err
	}

	return account, nil
}
