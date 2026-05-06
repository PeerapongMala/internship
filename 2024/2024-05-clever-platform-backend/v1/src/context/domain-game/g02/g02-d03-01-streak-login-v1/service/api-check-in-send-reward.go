package service

import (
	"errors"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type CheckInRequest struct {
	SubjectId   int    `json:"subject_id"`
	CheckInDate string `json:"check_in_date"`
	ResetFlag   bool   `json:"reset_flag"`
	IsCheckIn   bool   `json:"is_check_in"`
	UserId      string
}

// ==================== Response ==========================
type CheckInResponse struct {
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) CheckInSendReward(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &CheckInRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	err = api.Service.CheckInSendReward(&CheckInSendRewardInput{
		CheckInRequest: request,
	})

	if err != nil && err.Error() != "success with checkin date is before than last checkin" {
		return context.Status(http.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		},
		)
	}

	respMessage := "success"
	if err != nil {
		respMessage = err.Error()
	}

	return context.Status(http.StatusOK).JSON(CheckInResponse{
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    respMessage,
		},
	})
}

type CheckInSendRewardInput struct {
	*CheckInRequest
}

func (service *serviceStruct) CheckInSendReward(in *CheckInSendRewardInput) error {

	subjectCheckin, err := service.subjectCheckinStorage.GetSubjectCheckin(in.UserId, in.SubjectId)
	if err != nil {
		return err
	}

	checkInFromFE, err := helper.ConvertTimeStringToTime(in.CheckInDate)
	if err != nil {
		return err
	}

	if subjectCheckin.LastCheckin.After(*checkInFromFE) || subjectCheckin.LastCheckin.Equal(*checkInFromFE) {
		//skip when prevoius-checkin > current-checkin
		//return without error
		return errors.New("success with checkin date is before than last checkin")
	}

	currentSteak := subjectCheckin.CurrentStreak
	highestSteak := subjectCheckin.HighestStreak
	missLoginDaySlice := subjectCheckin.MissLoginDaySlice

	if in.ResetFlag {
		currentSteak = 1            //reset current steak
		missLoginDaySlice = []int{} //reset miss login day
	} else {
		currentSteak++
	}

	// if false
	if !in.IsCheckIn {
		missLoginDaySlice = append(missLoginDaySlice, currentSteak)
	}

	if currentSteak > highestSteak {
		highestSteak = currentSteak
	}

	dto := &constant.SubjectCheckinEntity{
		SubjectId:     in.SubjectId,
		StudentId:     in.UserId,
		LastCheckin:   *checkInFromFE,
		CurrentStreak: currentSteak,
		HighestStreak: highestSteak,
		MissLoginDay:  helper.ToPtr(helper.ConvertIntSlicesToIntStringWithCommas(missLoginDaySlice)),
	}

	err = service.subjectCheckinStorage.UpdateSubjectCheckin(dto)
	if err != nil {
		return err
	}

	//get reward data
	rewardData, err := service.subjectCheckinStorage.GetSubjectRewardBySubjectIdAndDay(in.SubjectId, currentSteak)
	if err != nil {
		return err
	}

	//update reward data
	inventoryDTO := constant.InventoryDTO{
		StudentId:  in.UserId,
		ArcadeCoin: helper.Deref(rewardData.ArcadeCoinAmount),
		GoldCoin:   helper.Deref(rewardData.GoldCoinAmount),
		IceAmount:  helper.Deref(rewardData.IceAmount),
	}

	tx, err := service.subjectCheckinStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	//add reward to inventory
	err = service.subjectCheckinStorage.UpdateInventory(tx, &inventoryDTO)
	if err != nil {
		return err
	}

	//add reward items to logs
	now := time.Now()
	rewardLogs := CreateRewardLogTransaction(&constant.RewardLogEntity{
		UserId:           &in.UserId,
		GoldCoinAmount:   rewardData.GoldCoinAmount,
		ArcadeCoinAmount: rewardData.ArcadeCoinAmount,
		IceAmount:        rewardData.IceAmount,
		ItemId:           rewardData.ItemId,
		ItemAmount:       rewardData.ItemAmount,
		Description:      helper.ToPtr("streak-login"),
		CreatedAt:        checkInFromFE,
		ReceivedAt:       &now,
	})

	for _, rewardLog := range rewardLogs {
		_, err = service.subjectCheckinStorage.InsertRewardLogs(tx, &rewardLog)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func CreateRewardLogTransaction(entity *constant.RewardLogEntity) []constant.RewardLogEntity {

	resp := []constant.RewardLogEntity{}
	if entity.GoldCoinAmount != nil && *entity.GoldCoinAmount != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:         entity.UserId,
			GoldCoinAmount: entity.GoldCoinAmount,
			Description:    entity.Description,
			ReceivedAt:     entity.ReceivedAt,
			CreatedAt:      entity.CreatedAt,
		})
	}

	if entity.ArcadeCoinAmount != nil && *entity.ArcadeCoinAmount != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:           entity.UserId,
			ArcadeCoinAmount: entity.ArcadeCoinAmount,
			Description:      entity.Description,
			ReceivedAt:       entity.ReceivedAt,
			CreatedAt:        entity.CreatedAt,
		})
	}

	if entity.IceAmount != nil && *entity.IceAmount != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:      entity.UserId,
			IceAmount:   entity.IceAmount,
			Description: entity.Description,
			ReceivedAt:  entity.ReceivedAt,
			CreatedAt:   entity.CreatedAt,
		})
	}

	if entity.ItemId != nil && *entity.ItemId != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:      entity.UserId,
			ItemId:      entity.ItemId,
			ItemAmount:  entity.ItemAmount,
			Description: entity.Description,
			ReceivedAt:  entity.ReceivedAt,
			CreatedAt:   entity.CreatedAt,
		})
	}

	if entity.AvatarId != nil && *entity.AvatarId != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:       entity.UserId,
			AvatarId:     entity.AvatarId,
			AvatarAmount: helper.ToPtr(1),
			Description:  entity.Description,
			ReceivedAt:   entity.ReceivedAt,
			CreatedAt:    entity.CreatedAt,
		})
	}

	if entity.PetId != nil && *entity.PetId != 0 {
		resp = append(resp, constant.RewardLogEntity{
			UserId:      entity.UserId,
			PetId:       entity.PetId,
			PetAmount:   helper.ToPtr(1),
			Description: entity.Description,
			ReceivedAt:  entity.ReceivedAt,
			CreatedAt:   entity.CreatedAt,
		})
	}

	return resp
}
