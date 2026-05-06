package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateCustomAvatarPetEquipped(context *fiber.Ctx) error {

	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	body, err := helper.ParseAndValidateRequest(context, &constant.UpdateInventoryAvatarPetEquippedValidation{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	data := constant.UpdateCustomAvatarPetEquippedRequest{
		StudentId:  studentId,
		IsEquipped: *body.IsEquipped,
		PetId:      body.PetId,
	}

	resp, err := api.Service.UpdateCustomAvatarPetEquipped(data)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CustomAvatarResponse{
		StatusCode: 200,
		Message:    "success",
		Data:       resp,
	})
}

func (s *serviceStruct) UpdateCustomAvatarPetEquipped(c constant.UpdateCustomAvatarPetEquippedRequest) (r constant.InventoryAvatarPetEntity, err error) {
	return s.customAvatarStorage.UpdateCustomAvatarPetEquipped(c)
}
