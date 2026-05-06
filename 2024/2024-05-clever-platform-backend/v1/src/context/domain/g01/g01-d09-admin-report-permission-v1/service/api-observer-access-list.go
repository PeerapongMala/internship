package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
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
	observerAccesses, err := service.adminReportPermissionStorage.ObserverAccessList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ObserverAccessListOutput{
		observerAccesses,
	}, nil
}
