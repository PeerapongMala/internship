package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) GetCustomAvatarItemCoupon(context *fiber.Ctx) error {
	studentId, ctxError := context.Locals("subjectId").(string)

	if !ctxError {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data := constant.GetInventoryAvatarItemRequest{
		StudentId: studentId,
		Type:      "coupon",
	}

	resp, err := api.Service.GetCustomAvatarItemCoupon(data)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CustomAvatarResponse{
		StatusCode: 200,
		Message:    "success",
		Data:       resp,
	})
}

func (s serviceStruct) GetCustomAvatarItemCoupon(c constant.GetInventoryAvatarItemRequest) (r []constant.InventoryAvatarItemEntity, err error) {
	items, err := s.customAvatarStorage.GetCustomAvatarItemCoupon(c)
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

	return items, nil
}
