package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) GetReportBug(context *fiber.Ctx) error {
	bugID, err := context.ParamsInt("bug_id")
	if err != nil {
		msg := "Bug id bad request"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	data, err := api.Service.GetReportBug(bugID)
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

func (service *serviceStruct) GetReportBug(bugID int) (*constant.Bug, error) {
	data, err := service.lineParentStorage.GetReportBug(bugID)
	if err != nil {
		return nil, err
	}

	for i, imageUrl := range data.ImageUrls {
		if imageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*imageUrl)
			if err != nil {
				return nil, err
			}
			data.ImageUrls[i] = url
		}
	}

	return data, nil
}
