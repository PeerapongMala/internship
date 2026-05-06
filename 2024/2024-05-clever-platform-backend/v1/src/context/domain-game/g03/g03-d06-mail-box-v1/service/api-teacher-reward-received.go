package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherRewardReceivedById(context *fiber.Ctx) error {
	rewardId, err := context.ParamsInt("rewardId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.ReceivedRequest{
		RewardId:  rewardId,
		StudentId: subjectId,
	}
	err = api.Service.TeacherRewardReceived(req)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "reward received",
	})
}
func (service *serviceStruct) TeacherRewardReceived(req constant.ReceivedRequest) error {
	itemId, err := service.mailBoxStorage.GetItemIdByRewardId(req.RewardId)
	if err != nil {
		return err
	}
	inventoryId, err := service.mailBoxStorage.GetinventoryId(req.StudentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	exist, err := service.mailBoxStorage.CheckItemInventoryExist(inventoryId, itemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	RewardAmount, err := service.mailBoxStorage.GetRewardItemAmount(req.RewardId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if exist {
		inventoryAmount, err := service.mailBoxStorage.GetInventoryItemAmountById(inventoryId, itemId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		totalamount := inventoryAmount + RewardAmount
		err = service.mailBoxStorage.UpdateUserItemAmount(inventoryId, totalamount, itemId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	} else {
		err = service.mailBoxStorage.ItemReceived(constant.ItemReceivedRequest{
			ItemId:      itemId,
			Amount:      RewardAmount,
			InventoryId: inventoryId,
		})
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	err = service.mailBoxStorage.TeacherRewardReceived(req)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	err = service.mailBoxStorage.RewardLogCreate(constant.RewardLogRequest{
		UserId:     req.StudentId,
		ItemId:     &itemId,
		ItemAmount: &RewardAmount,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
