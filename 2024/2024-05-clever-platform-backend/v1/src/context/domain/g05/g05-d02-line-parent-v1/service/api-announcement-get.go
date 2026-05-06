package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) AnnouncementGet(context *fiber.Ctx) error {
	announcementID, err := context.ParamsInt("announcement_id")
	if err != nil {
		msg := "Announcement id bad request"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	data, err := api.Service.AnnouncementGet(announcementID)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) AnnouncementGet(announcementID int) (*constant.Announcement, error) {
	data, err := service.lineParentStorage.AnnouncementGet(announcementID)
	if err != nil {
		return nil, err
	}
	return data, nil
}
