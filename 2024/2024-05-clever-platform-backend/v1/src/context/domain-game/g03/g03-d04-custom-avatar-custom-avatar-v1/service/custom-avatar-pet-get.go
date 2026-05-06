package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetCustomAvatarPetById(context *fiber.Ctx) error {

	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data := constant.GetInventoryAvatarRequest{
		StudentId: studentId,
	}

	resp, err := api.Service.GetCustomAvatarPetById(data)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CustomAvatarResponse{
		StatusCode: 200,
		Message:    "success",
		Data:       resp,
	})
}

func (s *serviceStruct) GetCustomAvatarPetById(c constant.GetInventoryAvatarRequest) (r []constant.InventoryAvatarPetEntity, err error) {
	return s.customAvatarStorage.GetCustomAvatarPetById(c)
}
