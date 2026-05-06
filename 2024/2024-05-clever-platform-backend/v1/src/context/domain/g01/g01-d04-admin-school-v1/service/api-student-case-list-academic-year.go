package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListAcademicYearResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListAcademicYear(context *fiber.Ctx) error {
	userId := context.Params("userId")

	studentCaseListAcademicYearOutput, err := api.Service.StudentCaseListAcademicYear(&StudentCaseListAcademicYearInput{
		UserId: userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListAcademicYearResponse{
		StatusCode: http.StatusOK,
		Data:       studentCaseListAcademicYearOutput.AcademicYears,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListAcademicYearInput struct {
	UserId string
}

type StudentCaseListAcademicYearOutput struct {
	AcademicYears []int
}

func (service *serviceStruct) StudentCaseListAcademicYear(in *StudentCaseListAcademicYearInput) (*StudentCaseListAcademicYearOutput, error) {
	academicYears, err := service.adminSchoolStorage.StudentCaseListAcademicYear(in.UserId)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListAcademicYearOutput{
		AcademicYears: academicYears,
	}, nil
}
