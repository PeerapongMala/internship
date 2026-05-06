package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type AcademicYearRangeListRequest struct {
	SchoolId int `query:"school_id" validate:"required"`
}

// ==================== Response ==========================

type AcademicYearRangeListResponse struct {
	StatusCode int                                `json:"status_code"`
	Pagination *helper.Pagination                 `json:"_pagination"`
	Data       []constant.AcademicYearRangeEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AcademicYearRangeList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &AcademicYearRangeListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	academicYearRangeListOutput, err := api.Service.AcademicYearRangeList(&AcademicYearRangeListInput{
		Pagination:                   pagination,
		AcademicYearRangeListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AcademicYearRangeListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       academicYearRangeListOutput.AcademicYearRanges,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AcademicYearRangeListInput struct {
	Pagination *helper.Pagination
	*AcademicYearRangeListRequest
}

type AcademicYearRangeListOutput struct {
	AcademicYearRanges []constant.AcademicYearRangeEntity
}

func (service *serviceStruct) AcademicYearRangeList(in *AcademicYearRangeListInput) (*AcademicYearRangeListOutput, error) {
	academicYears, err := service.repositoryTeacherStudent.AcademicYearRangeList(in.Pagination, in.SchoolId)
	if err != nil {
		return nil, err
	}

	return &AcademicYearRangeListOutput{
		academicYears,
	}, nil
}
