package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SeedYearListResponse struct {
	Pagination *helper.Pagination        `json:"_pagination"`
	StatusCode int                       `json:"status_code"`
	Data       []constant.SeedYearEntity `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedYearList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	seedYearListOutput, err := api.Service.SeedYearList(&SeedYearListInput{
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Data:       seedYearListOutput.SeedYears,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedYearListInput struct {
	Pagination *helper.Pagination
}

type SeedYearListOutput struct {
	SeedYears []constant.SeedYearEntity
}

func (service *serviceStruct) SeedYearList(in *SeedYearListInput) (*SeedYearListOutput, error) {
	seedYears, err := service.academicCourseStorage.SeedYearList(in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SeedYearListOutput{
		SeedYears: seedYears,
	}, nil
}
