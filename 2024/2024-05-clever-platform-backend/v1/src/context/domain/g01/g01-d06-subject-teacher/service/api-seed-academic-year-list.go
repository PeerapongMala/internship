package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SeedAcademicYearListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       []int              `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedAcademicYearList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	seedAcademicYearListOutput, err := api.Service.SeedAcademicYearList(&SeedAcademicYearListInput{
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedAcademicYearListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       seedAcademicYearListOutput.SeedAcademicYears,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedAcademicYearListInput struct {
	Pagination *helper.Pagination
}

type SeedAcademicYearListOutput struct {
	SeedAcademicYears []int
}

func (service *serviceStruct) SeedAcademicYearList(in *SeedAcademicYearListInput) (*SeedAcademicYearListOutput, error) {
	seedAcademicYears, err := service.subjectTeacherStorage.SeedAcademicYearList(in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SeedAcademicYearListOutput{
		seedAcademicYears,
	}, nil
}
