package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

type LevelSpecialRewardItemListRequest struct {
	constant.LevelSpecialRewardItemFilter
}

// ==================== Response ==========================

type LevelSpecialRewardItemListResponse struct {
	StatusCode int                                     `json:"status_code"`
	Pagination *helper.Pagination                      `json:"_pagination"`
	Data       []constant.LevelSpecialRewardItemEntity `json:"data"`
	Message    string                                  `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelSpecialRewardItemList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelSpecialRewardItemListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	levelSpecialRewardItemListOutput, err := api.Service.LevelSpecialRewardItemList(&LevelSpecialRewardItemListInput{
		Pagination:                        pagination,
		LevelSpecialRewardItemListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelSpecialRewardItemListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelSpecialRewardItemListOutput.LevelSpecialRewardItems,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelSpecialRewardItemListInput struct {
	Pagination *helper.Pagination
	*LevelSpecialRewardItemListRequest
}

type LevelSpecialRewardItemListOutput struct {
	LevelSpecialRewardItems []constant.LevelSpecialRewardItemEntity
}

func (service *serviceStruct) LevelSpecialRewardItemList(in *LevelSpecialRewardItemListInput) (*LevelSpecialRewardItemListOutput, error) {
	levelSpecialRewardItems, err := service.gamificationStorage.LevelSpecialRewardItemList(&in.LevelSpecialRewardItemFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, levelSpecialRewardItem := range levelSpecialRewardItems {
		if levelSpecialRewardItem.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*levelSpecialRewardItem.ImageUrl)
			if err != nil {
				return nil, err
			}
			levelSpecialRewardItems[i].ImageUrl = url
		}
	}

	return &LevelSpecialRewardItemListOutput{
		levelSpecialRewardItems,
	}, nil
}
