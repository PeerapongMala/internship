package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LevelRewardListRequest struct {
	constant.LevelRewardFilter
}

// ==================== Response ==========================

type LevelRewardListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.LevelRewardEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelRewardList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelRewardListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	levelRewardListOutput, err := api.Service.LevelRewardList(&LevelRewardListInput{
		Pagination:             pagination,
		LevelRewardListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&LevelRewardListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelRewardListOutput.LevelRewards,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelRewardListInput struct {
	Pagination *helper.Pagination
	*LevelRewardListRequest
}

type LevelRewardListOutput struct {
	LevelRewards []constant.LevelRewardEntity
}

func (service *serviceStruct) LevelRewardList(in *LevelRewardListInput) (*LevelRewardListOutput, error) {
	levelRewards, err := service.gamificationStorage.LevelRewardList(&in.LevelRewardFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LevelRewardListOutput{
		LevelRewards: levelRewards,
	}, nil
}
