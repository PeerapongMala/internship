package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type ClassListRequest struct {
	SchoolId     int    `query:"school_id" validate:"required"`
	SeedYear     string `query:"seed_year" validate:"required"`
	AcademicYear int    `query:"academic_year" validate:"required"`
}

type ClassListResponse struct {
	StatusCode int      `json:"status_code"`
	Data       []string `json:"data"`
	Message    string   `json:"message"`
}

func (api *APIStruct) ClassList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	classListOutput, err := api.Service.ClassList(&ClassListInput{
		ClassListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassListResponse{
		StatusCode: http.StatusOK,
		Data:       classListOutput.Classes,
		Message:    "Data retrieved",
	})
}

type ClassListInput struct {
	*ClassListRequest
}

type ClassListOutput struct {
	Classes []string
}

func (service *serviceStruct) ClassList(in *ClassListInput) (*ClassListOutput, error) {
	classes, err := service.gradeDataEntryStorage.ClassList(in.SeedYear, in.SchoolId, in.AcademicYear)
	if err != nil {
		return nil, err
	}

	return &ClassListOutput{
		Classes: classes,
	}, nil
}
