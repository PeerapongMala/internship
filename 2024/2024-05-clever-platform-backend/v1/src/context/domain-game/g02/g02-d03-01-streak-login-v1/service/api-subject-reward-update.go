package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
)

// ==================== Request ==========================

type SubjectRewardUpdateRequest struct {
	SubjectId        int  `json:"subject_id" validate:"required"`
	Day              int  `json:"day" validate:"required"`
	ItemId           *int `json:"item_id" `
	GoldCoinAmount   *int `json:"gold_coin_amount"`
	ArcadeCoinAmount *int `json:"arcade_coin_amount"`
	IceAmount        *int `json:"ice_amount"`
}

type DataUpdateResponseReward struct {
	Data    *constant.SubjectRewardEntity `json:"data"`
	Message string                        `json:"message"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectRewardUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectRewardUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reward := &constant.SubjectRewardEntity{}
	copier.Copy(reward, request)
	response, err := api.Service.SubjectRewardUpdate(reward)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(DataUpdateResponseReward{
		Data:    response,
		Message: "Reward updated",
	})
	// return nil
}

// ==================== Service ==========================
func (service *serviceStruct) SubjectRewardUpdate(reward *constant.SubjectRewardEntity) (*constant.SubjectRewardEntity, error) {
	response, err := service.subjectCheckinStorage.UpdateSubjectReward(reward)
	if err != nil {
		return nil, err
	}
	return response, nil
}
