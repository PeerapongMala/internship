package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) CheckMemberNotExist(context *fiber.Ctx) error {
	userID := context.Params("user_id")

	data, err := api.Service.CheckMemberNotExist(userID)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	var msg string
	if *data {
		msg = "User is not a member of the family"
	} else {
		msg = "User is a member of the family"

	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       data,
		Message:    msg,
	})
}

func (service *serviceStruct) CheckMemberNotExist(userID string) (*bool, error) {
	data, err := service.lineParentStorage.CheckMemberNotExist(userID)
	if err != nil {
		return nil, err
	}
	return data, nil
}
