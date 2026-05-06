package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) ReadByAnnouncementId(context *fiber.Ctx) error {
	announcementId, err := context.ParamsInt("announceId")
	if err != nil {
		log.Print(err)
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.ReadByAnnouncementId(announcementId, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "announcement read",
	})
}
func (service *serviceStruct) ReadByAnnouncementId(announcementId int, userId string) error {
	exist, err := service.globalAnnounceStorage.CheckRead(announcementId, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if exist {
		log.Printf("announcement ID %d already read", announcementId)
		return nil
	}
	err = service.globalAnnounceStorage.ReadByAnnouncementId(announcementId, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
