package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ObserverListResponse struct {
	StatusCode int                             `json:"status_code"`
	Pagination *helper.Pagination              `json:"_pagination"`
	Data       []constant.ObserverWithAccesses `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	observerFilter := constant.ObserverFilter{}
	err := context.QueryParser(&observerFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerListOutput, err := api.Service.ObserverList(&ObserverListInput{
		Pagination: pagination,
		Filter:     &observerFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       observerListOutput.ObserverList,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ObserverListInput struct {
	Pagination *helper.Pagination
	Filter     *constant.ObserverFilter
}

type ObserverListOutput struct {
	ObserverList []constant.ObserverWithAccesses
}

func (service *serviceStruct) ObserverList(in *ObserverListInput) (*ObserverListOutput, error) {
	observers, err := service.adminSchoolStorage.ObserverList(in.Pagination, in.Filter)
	if err != nil {
		return nil, err
	}

	for i, observer := range observers {
		if observer.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*observer.ImageUrl)
			if err != nil {
				return nil, err
			}
			observers[i].ImageUrl = url
		}
	}

	return &ObserverListOutput{
		ObserverList: observers,
	}, nil
}
