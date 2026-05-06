package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) ItemDropDown(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	req := constant.ItemDropDownRequest{}
	err := context.QueryParser(&req)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	response, totalCount, err := api.Service.ItemDropDown(pagination, req)
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
		Message: "Data retrived",
	})

}
func (service *serviceStruct) ItemDropDown(pagination *helper.Pagination, req constant.ItemDropDownRequest) ([]constant.ItemListDropDown, int, error) {

	ItemResponse, totalCount1, err := service.GmannounceStorage.ItemDropDown(pagination, req)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	for i, v := range ItemResponse {
		if ItemResponse[i].ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.ImageUrl)
			ItemResponse[i].ImageUrl = url
			if err != nil {
				return nil, 0, err
			}

		}
	}
	Totalcount := totalCount1
	response := ItemResponse
	if req.SchoolId != 0 && req.SubjectId != 0 {
		SchoolItem, totalCount2, err := service.GmannounceStorage.SchoolItemDropDown(pagination, req)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		for i, v := range SchoolItem {
			if SchoolItem[i].ImageUrl != nil {
				ItemUrl, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*v.ImageUrl)
				SchoolItem[i].ImageUrl = ItemUrl
				if err != nil {
					return nil, 0, err
				}

			}
		}
		Totalcount = totalCount1 + totalCount2
		response = append(response, SchoolItem...)
	}

	return response, Totalcount, nil
}
