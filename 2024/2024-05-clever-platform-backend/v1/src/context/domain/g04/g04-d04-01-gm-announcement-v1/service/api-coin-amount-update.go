package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) UpdateCoinAmount(context *fiber.Ctx) error {
	announceId, err := context.ParamsInt("announceId")
	if err != nil {
		log.Print(err)
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	req := constant.CoinDelete{}
	err = context.QueryParser(&req)
	if err != nil {
		log.Print(err)
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	err = api.Service.UpdateCoinAmount(req, announceId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Coin delete",
	})
}
func (service *serviceStruct) UpdateCoinAmount(req constant.CoinDelete, announceId int) error {
	err := service.GmannounceStorage.UpdateCoinAmount(req, announceId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
