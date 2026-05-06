package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SystemAnnouncementBulkEdit(context *fiber.Ctx) error {
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.SystemAnnouncementBulkEdit(subjectId, SubjectId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcement deleted . Please ensure announcement are read before deleting.",
	})
}
func (service *serviceStruct) SystemAnnouncementBulkEdit(userId string, subjectId int) error {

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
	response, _, err := service.mailBoxStorage.SystemAnnounceList(req, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	for _, v := range response {
		read, err := service.mailBoxStorage.CheckRead(v.AnnouncementId, userId)
		if err != nil {
			return err
		}
		print(read)
		if read {
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
