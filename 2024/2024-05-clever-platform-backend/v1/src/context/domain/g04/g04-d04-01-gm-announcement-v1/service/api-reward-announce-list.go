package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetRewardAnnounce(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant.RewardAnnounceFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	response, totalCount, err := api.Service.GetRewardAnnounce(pagination, filter, RolesCheck)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:          pagination.Page,
			LimitResponse: pagination.LimitResponse,
			TotalCount:    totalCount,
		},
		Data:    response,
		Message: "Data retrieved",
	})
}

func (service *serviceStruct) GetRewardAnnounce(pagination *helper.Pagination, filter constant.RewardAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.RewardAnnounceResponseService, int, error) {
	response, totalCount, err := service.GmannounceStorage.GetRewardAnnounce(pagination, filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	for i, v := range response {
		ItemList, err := service.GmannounceStorage.ItemList(v.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		CoinList, err := service.GmannounceStorage.CoinList(v.Id)
		for i, v := range ItemList {
			if ItemList[i].ImageUrl != nil {
				url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.ImageUrl)
				ItemList[i].ImageUrl = url
				if err != nil {
					return nil, 0, err
				}
			}
		}
		response[i].Coins = CoinList
		response[i].Items = ItemList

	}
	return response, totalCount, nil
}
