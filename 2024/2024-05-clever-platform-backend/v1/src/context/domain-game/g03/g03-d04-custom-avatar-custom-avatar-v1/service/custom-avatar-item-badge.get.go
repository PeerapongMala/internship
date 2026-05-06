package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetCustomAvatarItemBadge(context *fiber.Ctx) error {
	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data := constant.GetInventoryAvatarItemRequest{
		StudentId: studentId,
		Type:      "badge",
	}
	resp, err := api.Service.GetCustomAvatarItemBadge(data)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CustomAvatarResponse{
		StatusCode: 200,
		Message:    "success",
		Data:       resp,
	})
}

func (s *serviceStruct) GetCustomAvatarItemBadge(c constant.GetInventoryAvatarItemRequest) (r []constant.InventoryAvatarItemBadgeEntity, err error) {
	items, err := s.customAvatarStorage.GetCustomAvatarItemBadge(c)
	if err != nil {
		return nil, err
	}

	for i, item := range items {
		url, err := s.cloudStorage.ObjectCaseGenerateSignedUrl(item.ImageUrl)
		if err != nil {
			return nil, err
		}
		items[i].ImageUrl = *url
	}

	return s.customAvatarStorage.GetCustomAvatarItemBadge(c)
}
