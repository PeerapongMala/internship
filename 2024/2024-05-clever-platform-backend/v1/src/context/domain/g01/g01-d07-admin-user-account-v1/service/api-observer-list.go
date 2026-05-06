package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

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
	filter, err := helper.ParseAndValidateRequest(context, &constant.ObserverFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	observerListOutput, err := api.Service.ObserverList(&ObserverListInput{
		Pagination: pagination,
		Filter:     filter,
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
	observers, err := service.adminUserAccountStorage.ObserverList(in.Pagination, in.Filter)
	if err != nil {
		return nil, err
	}

	return &ObserverListOutput{
		ObserverList: observers,
	}, nil
}
