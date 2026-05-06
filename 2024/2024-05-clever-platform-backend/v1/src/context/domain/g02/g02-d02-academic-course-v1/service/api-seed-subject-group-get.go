package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type SeedSubjectGroupGetRequest struct {
	Id int `params:"id" validate:"required"`
}

// ==================== Response ==========================

type SeedSubjectGroupGetResponse struct {
	StatusCode int                               `json:"status_code"`
	Data       []constant.SeedSubjectGroupEntity `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SeedSubjectGroupGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedSubjectGroupGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.SeedSubjectGroupGet(&SeedSubjectGroupGetInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedSubjectGroupGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SeedSubjectGroupEntity{*output.SeedSubjectGroupEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedSubjectGroupGetInput struct {
	*SeedSubjectGroupGetRequest
}

type SeedSubjectGroupGetOutput struct {
	*constant.SeedSubjectGroupEntity
}

func (service *serviceStruct) SeedSubjectGroupGet(in *SeedSubjectGroupGetInput) (*SeedSubjectGroupGetOutput, error) {
	seedSubjectGroup, err := service.academicCourseStorage.SeedSubjectGroupGet(in.Id)
	if err != nil {
		return nil, err
	}

	return &SeedSubjectGroupGetOutput{
		seedSubjectGroup,
	}, nil
}
