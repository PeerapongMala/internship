package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SeedPlatformListResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.SeedPlatformEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedPlatformList(context *fiber.Ctx) error {
	seedPlatformLIstOutput, err := api.Service.SeedPlatformList()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return context.Status(http.StatusOK).JSON(SeedPlatformListResponse{
		StatusCode: http.StatusOK,
		Data:       seedPlatformLIstOutput.SeedPlatforms,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedPlatformListOutput struct {
	SeedPlatforms []constant.SeedPlatformEntity
}

func (service *serviceStruct) SeedPlatformList() (*SeedPlatformListOutput, error) {
	seedPlatforms, err := service.schoolAffiliationStorage.SeedPlatformList()
	if err != nil {
		return nil, err
	}

	return &SeedPlatformListOutput{
		seedPlatforms,
	}, nil
}
