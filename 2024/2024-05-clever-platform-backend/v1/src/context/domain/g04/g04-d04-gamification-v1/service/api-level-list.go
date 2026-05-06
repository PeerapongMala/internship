package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

type LevelListRequest struct {
	constant.LevelFilter
}

// ==================== Response ==========================

type LevelListResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.LevelEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	levelListOutput, err := api.Service.LevelList(&LevelListInput{
		Pagination:       pagination,
		LevelListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelListOutput.Levels,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelListInput struct {
	Pagination *helper.Pagination
	*LevelListRequest
}

type LevelListOutput struct {
	Levels []constant.LevelEntity
}

func (service *serviceStruct) LevelList(in *LevelListInput) (*LevelListOutput, error) {
	levels, err := service.gamificationStorage.LevelList(&in.LevelFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LevelListOutput{
		levels,
	}, nil
}
