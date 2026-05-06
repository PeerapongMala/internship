package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
)

// ==================== Request ==========================

// ==================== Response ==========================

type DataGetResponseReward struct {
	Data    []constant.SubjectRewardEntity `json:"data"`
	Message string                         `json:"message"`
}

type SubjectRewardRequest struct {
	SubjectId        int `json:"subject_id"`
	Day              int `json:"day"`
	ItemId           int `json:"item_id"`
	GoldCoinAmount   int `json:"gold_coin_amount"`
	ArcadeCoinAmount int `json:"arcade_coin_amount"`
	IceAmount        int `json:"ice_amount"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectRewardCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectRewardRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reward := &constant.SubjectRewardEntity{}
	copier.Copy(reward, request)

	err = api.Service.SubjectRewardCreate(reward)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(DataGetResponseReward{
		Data:    []constant.SubjectRewardEntity{*reward},
		Message: "Reward created",
	})
	// return nil
}

// ==================== Service ==========================
func (service *serviceStruct) SubjectRewardCreate(reward *constant.SubjectRewardEntity) error {
	err := service.subjectCheckinStorage.CreateSubjectReward(reward)
	if err != nil {
		return err
	}

	return nil
}
