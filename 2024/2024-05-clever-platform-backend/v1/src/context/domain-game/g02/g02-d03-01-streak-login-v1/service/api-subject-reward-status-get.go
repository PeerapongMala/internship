package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================
type SubjectRewardStatusGetBySubjectIdResponse struct {
	Data []constant.SubjectRewardWithItemEntity `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectRewardStatusGetBySubjectId(context *fiber.Ctx) error {

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, err) // Handle error if subjectId is not a valid integer
	}

	rewardWithStatus, err := api.Service.SubjectRewardStatusGetBySubjectId(subjectId, userId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectRewardStatusGetBySubjectIdResponse{
		Data: rewardWithStatus,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})

}

// ==================== Service ==========================
func (service *serviceStruct) SubjectRewardStatusGetBySubjectId(subjectId int, userId string) ([]constant.SubjectRewardWithItemEntity, error) {

	rewards, err := service.subjectCheckinStorage.GetSubjectRewardBySubjectId(subjectId)
	if err != nil {
		return nil, err
	}

	subjectCheckInData, err := service.GetStreakLoginStat(&GetStreakLoginStatInput{SubjectId: subjectId, UserId: userId})
	if err != nil {
		return nil, err
	}

	if len(rewards) != 0 {
		diff := subjectCheckInData.CurrentStreak - len(rewards)
		if diff > 0 {
			for i := 0; i < diff; i++ {
				rewards = append(rewards, rewards[i%len(rewards)])
				rewards[len(rewards)-1].SubjectRewardEntity.Day = helper.ToPtr(len(rewards))
			}
		}
	}

	STATUS_CHECKIN := "checkin"
	STATUS_NON_CHECKIN := "non-checkin"
	STATUS_ICE := "ice"

	for i, reward := range rewards {
		if subjectCheckInData.CurrentStreak >= helper.Deref(reward.Day) && slices.Contains(subjectCheckInData.MissLoginDaySlice, helper.Deref(reward.Day)) {
			rewards[i].Status = STATUS_ICE
		} else if subjectCheckInData.CurrentStreak >= helper.Deref(reward.Day) {
			rewards[i].Status = STATUS_CHECKIN
		} else {
			rewards[i].Status = STATUS_NON_CHECKIN
		}
	}

	return rewards, nil
}
