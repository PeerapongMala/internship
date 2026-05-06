package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) EventAnnounceList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.AnnouncementListRequest{
		UserId:    subjectId,
		SubjectId: SubjectId,
	}
	response, totalCount, err := api.Service.EventAnnounceList(req, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
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
func (service *serviceStruct) EventAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.EventAnnounceResponse, int, error) {

	schoolId, err := service.mailBoxStorage.GetSchoolByStudentId(req.UserId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	request := constant.AnnouncementListRequest{
		UserId:    req.UserId,
		SchoolId:  schoolId,
		SubjectId: req.SubjectId,
	}
	response, totalCount, err := service.mailBoxStorage.EventAnnounceList(request, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	for i, v := range response {
		if response[i].ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.ImageUrl)
			if err != nil {
				return nil, 0, err
			}
			response[i].ImageUrl = url

		}
		exist, err := service.mailBoxStorage.CheckRead(v.AnnouncementId, req.UserId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		if exist {
			response[i].Isread = exist
		} else {
			response[i].Isread = exist
		}
	}
	return response, totalCount, nil

}
