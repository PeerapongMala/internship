package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ===========================

type SeedSubjectGroupUpdateRequest struct {
	Id   int    `params:"id" validate:"required"`
	Name string `json:"name" validate:"required"`
}

// ==================== Response ==========================

type SeedSubjectGroupUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedSubjectGroupUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedSubjectGroupUpdateRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.SeedSubjectGroupUpdate(&SeedSubjectGroupUpdateInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SeedSubjectGroupUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Seed subject group updated",
	})
}

// ==================== Service ==========================

type SeedSubjectGroupUpdateInput struct {
	*SeedSubjectGroupUpdateRequest
}

func (service *serviceStruct) SeedSubjectGroupUpdate(in *SeedSubjectGroupUpdateInput) error {
	return service.academicCourseStorage.SeedSubjectGroupUpdate(&constant.SeedSubjectGroupEntity{
		Id:   in.Id,
		Name: in.Name,
	})
}
