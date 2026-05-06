package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) RewardAnnouncementBulkEdit(context *fiber.Ctx) error {
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.RewardAnnouncementBulkEdit(subjectId, SubjectId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcement deleted . Please ensure items are received before deleting.",
	})
}
func (service *serviceStruct) RewardAnnouncementBulkEdit(userId string, subjectId int) error {

	schoolId, err := service.mailBoxStorage.GetSchoolByStudentId(userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	pagination := helper.PaginationDefault()
	req := constant.AnnouncementListRequest{
		UserId:    userId,
		SchoolId:  schoolId,
		SubjectId: subjectId,
	}
	response, _, err := service.mailBoxStorage.RewardAnnounceList(req, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	for _, v := range response {
		read, err := service.mailBoxStorage.CheckRead(v.AnnouncementId, userId)
		if err != nil {
			return err
		}
		received, err := service.mailBoxStorage.CheckReceived(v.AnnouncementId, userId)
		if err != nil {
			return err
		}
		if read && received {
			deleteRequest := constant.AnnouncementDeleteRequest{
				UserId:         userId,
				AnnouncementId: v.AnnouncementId,
			}
			err = service.mailBoxStorage.UpdateDelete(deleteRequest)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}
	}
	return nil
}
