package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherRewardDeleteById(context *fiber.Ctx) error {
	RewardId, err := context.ParamsInt("rewardId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	err = api.Service.RewardDelete(RewardId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "reward message deleted",
	})
}
func (service *serviceStruct) RewardDelete(rewardId int) error {
	received, err := service.mailBoxStorage.CheckTeacherRewardReceived(rewardId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if !received {
		msg := "user must received reward before delete message"
		return helper.NewHttpError(http.StatusConflict, &msg)
	} else {
		err = service.mailBoxStorage.RewardDelete(rewardId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil
}
