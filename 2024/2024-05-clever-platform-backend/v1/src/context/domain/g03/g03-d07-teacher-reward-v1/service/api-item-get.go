package service

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) ItemGet(context *fiber.Ctx) error {
	itemId, err := context.ParamsInt("itemId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	response, err := api.Service.ItemGet(itemId)
	if err != nil {
		return helper.RespondHttpError(context, err)

	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "data received",
	})
}
func (service *serviceStruct) ItemGet(itemId int) (*constant.ItemInfo, error) {
	response, err := service.teacherRewardStorage.ItemGet(itemId)
	if err != nil {
		if err == sql.ErrNoRows {
			msg := "data not found"
			return nil, helper.NewHttpError(http.StatusNotFound, &msg)
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if response.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*response.ImageUrl)
		if err != nil {
			return nil, err
		}
		response.ImageUrl = url
	}
	return response, nil
}
