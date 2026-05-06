package service

import (
	"log"
	"net/http"
	"os"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) IncreaseCoin(context *fiber.Ctx) error {
	body := constant.IncreaseCoinRequest{}
	err := context.BodyParser(&body)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	body.UserId = subjectId
	err = api.Service.IncreaseCoin(body)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Arcade Coin increased successfully",
	})
}
func (service *serviceStruct) IncreaseCoin(req constant.IncreaseCoinRequest) error {
	Env := os.Getenv("ENV")
	if Env != "TEST" {
		msg := "This API can only be used in TEST environment"
		return helper.NewHttpError(http.StatusForbidden, &msg)
	}
	userCoin, err := service.ArcadeGameStorage.GetStudentArcadeCoinById(req.UserId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	TotalCoin := userCoin + req.ArcadeCoin

	err = service.ArcadeGameStorage.IncreaseCoin(constant.IncreaseCoinRequest{
		UserId:     req.UserId,
		ArcadeCoin: TotalCoin,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
