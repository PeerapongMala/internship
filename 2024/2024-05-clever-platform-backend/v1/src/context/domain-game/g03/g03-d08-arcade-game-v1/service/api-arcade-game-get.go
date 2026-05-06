package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) ArcadeGameGet(context *fiber.Ctx) error {
	arcadeGameId, err := context.ParamsInt("arcadeGameId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	response, err := api.Service.ArcadeGameInfo(arcadeGameId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "success",
	})
}
func (service *serviceStruct) ArcadeGameInfo(arcadeGameId int) (*constant.ArcadeGameInfo, error) {
	response, err := service.arcadeGameStorage.ArcadeGameInfo(arcadeGameId)
	if err != nil {
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
