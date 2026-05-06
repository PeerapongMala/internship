package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type AcademicYearRangeDeleteRequest struct {
	AcademicYearRangeId int `params:"academicYearRangeId" validate:"required"`
}

type AcademicYearRangeDeleteResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AcademicYearRangeDelete(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AcademicYearRangeDeleteRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.AcademicYearRangeDelete(&AcademicYearRangeDeleteInput{
		AcademicYearRangeDeleteRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AcademicYearRangeDeleteResponse{
		StatusCode: http.StatusOK,
		Message:    "Deleted",
	})
}

// ==================== Service ==========================

type AcademicYearRangeDeleteInput struct {
	*AcademicYearRangeDeleteRequest
}

func (service *serviceStruct) AcademicYearRangeDelete(in *AcademicYearRangeDeleteInput) error {
	isExists, err := service.repositoryTeacherStudent.AcademicYearRangeCheck(in.AcademicYearRangeId)
	if err != nil {
		return err
	}

	if isExists != nil && *isExists {
		msg := "This academic year is in use"
		return helper.NewHttpError(http.StatusConflict, &msg)
	}

	err = service.repositoryTeacherStudent.AcademicYearRangeDelete(in.AcademicYearRangeId)
	if err != nil {
		return err
	}

	return nil
}
