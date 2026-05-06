package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SeedPlatformListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"pagination"`
	Data       []constant.SeedPlatformEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedPlatformList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	seedPlatformListOutput, err := api.Service.SeedPlatformList(&SeedPlatformListInput{
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedPlatformListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       seedPlatformListOutput.SeedPlatforms,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedPlatformListInput struct {
	Pagination *helper.Pagination
}

type SeedPlatformListOutput struct {
	SeedPlatforms []constant.SeedPlatformEntity
}

func (service *serviceStruct) SeedPlatformList(in *SeedPlatformListInput) (*SeedPlatformListOutput, error) {
	seedPlatforms, err := service.academicCourseStorage.SeedPlatformList(in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SeedPlatformListOutput{
		seedPlatforms,
	}, nil
}
