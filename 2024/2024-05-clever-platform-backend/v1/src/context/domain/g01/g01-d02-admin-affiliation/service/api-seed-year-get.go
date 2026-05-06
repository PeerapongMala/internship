package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"
)

// ==================== Request ==========================

type SeedYearGetRequest struct {
	SeedYearId int `params:"seedYearId" validate:"required"`
}

// ==================== Response ==========================

type SeedYearGetResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []constant.SeedYearEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedYearGet(context *fiber.Ctx) error {
	log.Println("test")
	request, err := helper.ParseAndValidateRequest(context, &SeedYearGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	seedYearGetOutput, err := api.Service.SeedYearGet(&SeedYearGetInput{
		SeedYearGetRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SeedYearEntity{*seedYearGetOutput.SeedYearEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedYearGetInput struct {
	*SeedYearGetRequest
}

type SeedYearGetOutput struct {
	*constant.SeedYearEntity
}

func (service *serviceStruct) SeedYearGet(in *SeedYearGetInput) (*SeedYearGetOutput, error) {
	seedYear, err := service.schoolAffiliationStorage.SeedYearGet(in.SeedYearId)
	if err != nil {
		return nil, err
	}

	return &SeedYearGetOutput{
		seedYear,
	}, nil
}
