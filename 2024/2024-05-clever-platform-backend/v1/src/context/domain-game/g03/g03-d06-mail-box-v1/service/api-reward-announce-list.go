package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) RewardAnnounceList(context *fiber.Ctx) error {
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
	response, totalCount, err := api.Service.RewardAnnounceList(req, pagination)
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
func (service *serviceStruct) RewardAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.RewardAnnounceResponse, int, error) {
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
	response, totalCount, err := service.mailBoxStorage.RewardAnnounceList(request, pagination)
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
		ItemList, err := service.mailBoxStorage.RewardItemList(v.AnnouncementId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		for index, value := range ItemList {
			if ItemList[index].ItemImage != nil {
				ItemUrl, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*value.ItemImage)
				if err != nil {
					return nil, 0, err
				}
				ItemList[index].ItemImage = ItemUrl
			}
		}
		response[i].ItemList = ItemList
		exist, err := service.mailBoxStorage.CheckCoinExist(v.AnnouncementId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		if exist {
			CoinInfo, err := service.mailBoxStorage.GetCoinInfoByAnnouncementId(v.AnnouncementId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, 0, err
			}
			response[i].CoinList = CoinInfo
		} else {
			response[i].CoinList = nil
		}
		Readexist, err := service.mailBoxStorage.CheckRead(v.AnnouncementId, req.UserId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		if exist {
			response[i].Isread = Readexist
		} else {
			response[i].Isread = Readexist
		}

		Received, err := service.mailBoxStorage.CheckItemReceived(v.AnnouncementId, req.UserId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		if Received {
			response[i].IsReceived = Received
		} else {
			response[i].IsReceived = Received
		}

	}
	return response, totalCount, nil
}
