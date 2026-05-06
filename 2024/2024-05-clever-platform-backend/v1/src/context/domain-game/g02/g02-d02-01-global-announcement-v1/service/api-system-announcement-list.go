package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) SystemAnnouncementList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	response, totalCount, err := api.Service.SystemAnnouncementList(subjectId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    totalCount,
		},
		Data:    response,
		Message: "Data retrived",
	})

}
func (service *serviceStruct) SystemAnnouncementList(userId string, pagination *helper.Pagination) ([]constant.AnnouncementResponse, int, error) {
	schoolId, err := service.globalAnnounceStorage.GetSchoolIdByStudentId(userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	response, totalCount, err := service.globalAnnounceStorage.SystemAnnouncementList(schoolId, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	if len(response) == 0 {
		msg := "No announcement at this time"
		return nil, 0, helper.NewHttpError(http.StatusNotFound, &msg)
	}
	for i, v := range response {
		read, err := service.globalAnnounceStorage.CheckRead(v.AnnouncementId, userId)
		if err != nil {
			return nil, 0, err
		}
		if read {
			response[i].IsRead = read
		} else {
			response[i].IsRead = read
		}
		if response[i].ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.ImageUrl)
			if err != nil {
				return nil, 0, err
			}
			response[i].ImageUrl = url

		}
	}
	return response, totalCount, nil
}
