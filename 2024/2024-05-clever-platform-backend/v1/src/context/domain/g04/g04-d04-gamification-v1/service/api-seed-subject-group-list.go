package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ===========================

// ==================== Response ==========================

type SeedSubjectGroupListResponse struct {
	StatusCode int                               `json:"status_code"`
	Pagination *helper.Pagination                `json:"_pagination"`
	Data       []constant.SeedSubjectGroupEntity `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedSubjectGroupList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	seedSubjectGroupListOutput, err := api.Service.SeedSubjectGroupList(&SeedSubjectGroupListInput{
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedSubjectGroupListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       seedSubjectGroupListOutput.SeedSubjectGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedSubjectGroupListInput struct {
	Pagination *helper.Pagination
}

type SeedSubjectGroupListOutput struct {
	SeedSubjectGroups []constant.SeedSubjectGroupEntity
}

func (service *serviceStruct) SeedSubjectGroupList(in *SeedSubjectGroupListInput) (*SeedSubjectGroupListOutput, error) {
	subjectGroups, err := service.gamificationStorage.SeedSubjectGroupList(in.Pagination)
	if err != nil {
		return nil, err
	}
	return &SeedSubjectGroupListOutput{
		SeedSubjectGroups: subjectGroups,
	}, nil
}
