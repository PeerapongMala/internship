package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) DeleteAnnouncementItem(context *fiber.Ctx) error {
	announceId, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	itemId, err := context.ParamsInt("itemId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.DeleteAnnouncementItem(announceId, itemId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Item deleted",
	})
}
func (service *serviceStruct) DeleteAnnouncementItem(announceId int, ItemId int) error {
	err := service.GmannounceStorage.DeleteAnnouncementItem(announceId, ItemId)
	if err != nil {
		log.Printf("%+v", err)
		return err
	}
	return nil
}
