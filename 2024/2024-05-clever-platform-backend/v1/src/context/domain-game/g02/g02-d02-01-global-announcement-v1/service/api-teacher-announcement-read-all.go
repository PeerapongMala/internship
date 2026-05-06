package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherReadAll(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err := api.Service.TeacherReadAll(subjectId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "announcement read",
	})
}
func (service *serviceStruct) TeacherReadAll(userId string) error {
	schoolId, err := service.globalAnnounceStorage.GetSchoolIdByStudentId(userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	pagination := helper.PaginationDefault()
	response, _, err := service.globalAnnounceStorage.TeacherAnnoucementList(schoolId, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	for _, v := range response {
		exist, err := service.globalAnnounceStorage.CheckRead(v.AnnouncementId, userId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if exist {
			continue
		}
		err = service.globalAnnounceStorage.ReadByAnnouncementId(v.AnnouncementId, userId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
