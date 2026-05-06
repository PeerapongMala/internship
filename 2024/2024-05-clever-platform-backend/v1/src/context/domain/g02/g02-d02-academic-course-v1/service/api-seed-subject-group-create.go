package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type SeedSubjectGroupCreateRequest struct {
	Name string `json:"name" validate:"required"`
}

// ==================== Response ==========================

type SeedSubjectGroupCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedSubjectGroupCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedSubjectGroupCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.SeedSubjectGroupCreate(&SeedSubjectGroupCreateInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SeedSubjectGroupCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Seed subject group created",
	})
}

// ==================== Service ==========================

type SeedSubjectGroupCreateInput struct {
	*SeedSubjectGroupCreateRequest
}

func (service *serviceStruct) SeedSubjectGroupCreate(in *SeedSubjectGroupCreateInput) error {
	seedSubjectGroup := constant.SeedSubjectGroupEntity{
		Name: in.Name,
	}

	return service.academicCourseStorage.SeedSubjectGroupCreate(&seedSubjectGroup)
}
