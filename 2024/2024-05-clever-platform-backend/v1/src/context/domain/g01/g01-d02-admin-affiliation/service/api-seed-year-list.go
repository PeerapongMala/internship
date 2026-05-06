package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SeedYearListResponse struct {
	StatusCode int                       `json:"status_code"`
	Pagination *helper.Pagination        `json:"_pagination"`
	Data       []constant.SeedYearEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedYearList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter, err := helper.ParseAndValidateRequest(context, &constant.SeedYearFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	seedYearListOutput, err := api.Service.SeedYearList(&SeedYearListInput{
		Filter:     filter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       seedYearListOutput.SeedYears,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedYearListInput struct {
	Filter     *constant.SeedYearFilter
	Pagination *helper.Pagination
}

type SeedYearListOutput struct {
	SeedYears []constant.SeedYearEntity
}

func (service *serviceStruct) SeedYearList(in *SeedYearListInput) (*SeedYearListOutput, error) {
	seedYears, err := service.schoolAffiliationStorage.SeedYearList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SeedYearListOutput{
		seedYears,
	}, nil
}
