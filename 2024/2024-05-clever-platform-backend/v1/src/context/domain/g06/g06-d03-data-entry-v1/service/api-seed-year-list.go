package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type SeedYearListResponse struct {
	StatusCode int      `json:"status_code"`
	Data       []string `json:"data"`
	Message    string   `json:"message"`
}

func (api *APIStruct) SeedYearList(context *fiber.Ctx) error {
	seedYearListOutput, err := api.Service.SeedYearList()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearListResponse{
		StatusCode: http.StatusOK,
		Data:       seedYearListOutput.SeedYears,
		Message:    "Data retrieved",
	})
}

type SeedYearListOutput struct {
	SeedYears []string
}

func (service *serviceStruct) SeedYearList() (*SeedYearListOutput, error) {
	seedYears, err := service.gradeDataEntryStorage.SeedYearList()
	if err != nil {
		return nil, err
	}

	return &SeedYearListOutput{
		SeedYears: seedYears,
	}, nil
}
