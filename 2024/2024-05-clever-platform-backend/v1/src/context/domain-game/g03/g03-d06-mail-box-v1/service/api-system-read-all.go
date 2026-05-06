package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SystemReadAll(context *fiber.Ctx) error {
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.SystemReadAll(subjectId, SubjectId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcements Read",
	})
}
func (service *serviceStruct) SystemReadAll(userId string, subjectId int) error {
	schoolId, err := service.mailBoxStorage.GetSchoolByStudentId(userId)
	if err != nil {
		return err
	}
	req := constant.AnnouncementListRequest{
		UserId:    userId,
		SchoolId:  schoolId,
		SubjectId: subjectId,
	}
	pagination := helper.PaginationDefault()
	AnnouncementList, _, err := service.mailBoxStorage.SystemAnnounceList(req, pagination)
	if err != nil {
		return err
	}

	for _, announcement := range AnnouncementList {
		read, err := service.mailBoxStorage.CheckRead(announcement.AnnouncementId, userId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if read {
			continue
		}
		err = service.mailBoxStorage.AnnouncementRead(constant.AnnouncementReadRequest{
			UserId:         userId,
			AnnouncementId: announcement.AnnouncementId,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
