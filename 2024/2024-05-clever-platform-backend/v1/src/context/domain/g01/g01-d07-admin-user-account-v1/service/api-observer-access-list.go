package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ObserverAccessListResponse struct {
	StatusCode int                             `json:"status_code"`
	Pagination *helper.Pagination              `json:"_pagination"`
	Data       []constant.ObserverAccessEntity `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessList(context *fiber.Ctx) error {
	filter, err := helper.ParseAndValidateRequest(context, &constant.ObserverAccessFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	observerAccessListOutput, err := api.Service.ObserverAccessList(&ObserverAccessListInput{
		Filter:     filter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverAccessListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       observerAccessListOutput.ObserverAccesses,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ObserverAccessListInput struct {
	Filter     *constant.ObserverAccessFilter
	Pagination *helper.Pagination
}

type ObserverAccessListOutput struct {
	ObserverAccesses []constant.ObserverAccessEntity
}

func (service *serviceStruct) ObserverAccessList(in *ObserverAccessListInput) (*ObserverAccessListOutput, error) {
	observerAccesses, err := service.adminUserAccountStorage.ObserverAccessList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ObserverAccessListOutput{
		ObserverAccesses: observerAccesses,
	}, nil
}
