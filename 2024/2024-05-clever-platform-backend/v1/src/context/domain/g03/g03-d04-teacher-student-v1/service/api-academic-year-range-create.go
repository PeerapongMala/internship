package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type AcademicYearRangeCreateRequest struct {
	SchoolId  int        `json:"school_id" validate:"required"`
	Name      string     `json:"name" validate:"required"`
	StartDate *time.Time `json:"start_date" validate:"required"`
	EndDate   *time.Time `json:"end_date" validate:"required"`
}

// ==================== Response ==========================

type AcademicYearRangeCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AcademicYearRangeCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AcademicYearRangeCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.AcademicYearRangeCreate(&AcademicYearRangeCreateInput{
		AcademicYearRangeCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AcademicYearRangeCreateResponse{
		StatusCode: http.StatusOK,
		Message:    "Created",
	})
}

// ==================== Service ==========================

type AcademicYearRangeCreateInput struct {
	*AcademicYearRangeCreateRequest
}

func (service *serviceStruct) AcademicYearRangeCreate(in *AcademicYearRangeCreateInput) error {
	err := service.repositoryTeacherStudent.AcademicYearRangeCreate(in.SchoolId, in.Name, in.StartDate, in.EndDate)
	if err != nil {
		return err
	}

	return nil
}
