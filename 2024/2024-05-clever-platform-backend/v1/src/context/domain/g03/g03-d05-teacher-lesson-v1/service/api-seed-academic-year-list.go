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

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	seedAcademicYearListOutput, err := api.Service.SeedAcademicYearList(&SeedAcademicYearListInput{
		Pagination: pagination,
		SubjectId:  subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedAcademicYearListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       seedAcademicYearListOutput.AcademicYears,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SeedAcademicYearListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
}

type SeedAcademicYearListOutput struct {
	AcademicYears []int
}

func (service *serviceStruct) SeedAcademicYearList(in *SeedAcademicYearListInput) (*SeedAcademicYearListOutput, error) {
	academicYears, err := service.teacherLessonStorage.SeedAcademicYearList(in.Pagination, in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &SeedAcademicYearListOutput{
		academicYears,
	}, nil
}
