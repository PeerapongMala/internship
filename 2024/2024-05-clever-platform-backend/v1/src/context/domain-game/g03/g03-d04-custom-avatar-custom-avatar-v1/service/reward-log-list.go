package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type RewardLogListResponse struct {
	StatusCode int                        `json:"status_code"`
	Pagination *helper.Pagination         `json:"_pagination"`
	Data       []constant.RewardLogEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) RewardLogList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	rewardLogListOutput, err := api.Service.RewardLogList(&RewardLogListInput{
		Pagination: pagination,
		SubjectId:  subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(RewardLogListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       rewardLogListOutput.RewardLogs,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type RewardLogListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
}

type RewardLogListOutput struct {
	RewardLogs []constant.RewardLogEntity
}

func (service *serviceStruct) RewardLogList(in *RewardLogListInput) (*RewardLogListOutput, error) {
	rewardLogs, err := service.customAvatarStorage.RewardLogList(in.SubjectId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &RewardLogListOutput{
		RewardLogs: rewardLogs,
	}, nil
}
