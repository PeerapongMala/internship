package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d08-chat-config-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) ConfigList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	data, err := api.Service.ConfigList(pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) ConfigList(pagination *helper.Pagination) ([]*constant.Config, error) {
	configs, err := service.chatConfigStorage.ConfigList(pagination)
	if err != nil {
		return nil, err
	}
	return configs, nil
}
