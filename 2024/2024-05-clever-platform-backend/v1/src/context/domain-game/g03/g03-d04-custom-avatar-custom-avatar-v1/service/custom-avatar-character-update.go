package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateCustomAvatarCharacterEquipped(context *fiber.Ctx) error {

	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	body, err := helper.ParseAndValidateRequest(context, &constant.UpdateInventoryAvatarEquippedValidation{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	data := constant.UpdateInventoryAvatarEquippedRequest{
		StudentId:  studentId,
		AvatarId:   body.AvatarId,
		IsEquipped: body.IsEquipped,
	}

	resp, err := api.Service.UpdateCustomAvatarCharacterEquipped(data)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CustomAvatarResponse{
		Data:       resp,
		Message:    "success",
		StatusCode: http.StatusOK,
	})

}
func (s *serviceStruct) UpdateCustomAvatarCharacterEquipped(c constant.UpdateInventoryAvatarEquippedRequest) (r constant.InventoryAvatarEntity, err error) {
	return s.customAvatarStorage.UpdateCustomAvatarCharacterEquipped(c)
}
