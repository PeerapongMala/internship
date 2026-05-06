package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) TeacherRewardReceivedAll(context *fiber.Ctx) error {
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.RewardReceivedAll(SubjectId, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "reward received",
	})
}
func (service *serviceStruct) RewardReceivedAll(subjectId int, studentId string) error {
	pagination := helper.PaginationDefault()
	Rewardreq := constant.TeacherRewardRequest{
		SubjectId: subjectId,
		StudentId: studentId,
	}
	response, err := service.mailBoxStorage.TeacherRewardList(Rewardreq, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	for _, v := range response {
		received, err := service.mailBoxStorage.CheckTeacherRewardReceived(v.RewardId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if received {
			continue
		}
		itemId, err := service.mailBoxStorage.GetItemIdByRewardId(v.RewardId)
		if err != nil {
			return err
		}
		inventoryId, err := service.mailBoxStorage.GetinventoryId(studentId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		exist, err := service.mailBoxStorage.CheckItemInventoryExist(inventoryId, itemId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		RewardAmount, err := service.mailBoxStorage.GetRewardItemAmount(v.RewardId)
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
		err = service.mailBoxStorage.TeacherRewardReceived(constant.ReceivedRequest{
			RewardId:  v.RewardId,
			StudentId: studentId,
		})
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		err = service.mailBoxStorage.RewardLogCreate(constant.RewardLogRequest{
			UserId:     studentId,
			ItemId:     &itemId,
			ItemAmount: &RewardAmount,
		})
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil
}
