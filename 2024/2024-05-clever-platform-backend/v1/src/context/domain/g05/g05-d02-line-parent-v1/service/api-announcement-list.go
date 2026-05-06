package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) AnnouncementList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	studentID := context.Params("user_id")

	data, err := api.Service.AnnouncementList(studentID, pagination)
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

func (service *serviceStruct) AnnouncementList(userID string, pagination *helper.Pagination) ([]*constant.AnnouncementList, error) {
	data, err := service.lineParentStorage.AnnouncementList(userID, pagination)
	if err != nil {
		return nil, err
	}
	return data, nil
}
