package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) UserAnnouncementDelete(context *fiber.Ctx) error {
	announceId, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	req := constant.AnnouncementDeleteRequest{
		UserId:         subjectId,
		AnnouncementId: announceId,
	}
	err = api.Service.UpdateDelete(req)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "User announcement has deleted",
	})
}
func (service *serviceStruct) UpdateDelete(req constant.AnnouncementDeleteRequest) error {

	Type, err := service.mailBoxStorage.GetAnnouncementType(req.AnnouncementId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	if Type == "reward" {
		exist, err := service.mailBoxStorage.CheckReceived(req.AnnouncementId, req.UserId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if !exist {
			msg := "User must claim item before deleted announcement"
			return helper.NewHttpError(http.StatusConflict, &msg)
		}
		err = service.mailBoxStorage.UpdateDelete(req)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	} else {
		exist, err := service.mailBoxStorage.CheckRead(req.AnnouncementId, req.UserId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if !exist {
			msg := "User must reaad before deleted announcement"
			return helper.NewHttpError(http.StatusConflict, &msg)
		}
		err = service.mailBoxStorage.UpdateDelete(req)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil

}
