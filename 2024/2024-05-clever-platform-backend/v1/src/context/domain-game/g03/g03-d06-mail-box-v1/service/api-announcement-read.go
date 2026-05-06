package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) UserAnnouncementCreate(context *fiber.Ctx) error {
	announceId, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	req := constant.AnnouncementReadRequest{
		UserId:         subjectId,
		AnnouncementId: announceId,
	}
	err = api.Service.AnnouncementRead(req)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	msg := fmt.Sprintf("Announcement Id %d has read", announceId)
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    msg,
	})
}
func (service *serviceStruct) AnnouncementRead(req constant.AnnouncementReadRequest) error {
	exist, err := service.mailBoxStorage.CheckRead(req.AnnouncementId, req.UserId)
	if err != nil {

		log.Printf("%+v", errors.WithStack(err))
		return err

	}
	if exist {
		return nil
	}
	err = service.mailBoxStorage.AnnouncementRead(req)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
