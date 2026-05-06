package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type SeedAcademicYearListResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

func (api *APIStruct) SeedAcademicYearList(context *fiber.Ctx) error {
	seedAcademicYearListOutput, err := api.Service.SeedAcademicYearList(&SeedAcademicYearListInput{
		SubjectId: context.Locals("subjectId").(string),
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedAcademicYearListResponse{
		StatusCode: http.StatusOK,
		Data:       seedAcademicYearListOutput.AcademicYears,
		Message:    "Data retrieved",
	})
}

type SeedAcademicYearListInput struct {
	SubjectId string
}

type SeedAcademicYearListOutput struct {
	AcademicYears []int
}

func (service *serviceStruct) SeedAcademicYearList(in *SeedAcademicYearListInput) (*SeedAcademicYearListOutput, error) {
	academicYears, err := service.gradeDataEntryStorage.SeedAcademicYearList(in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &SeedAcademicYearListOutput{
		AcademicYears: academicYears,
	}, nil
}
