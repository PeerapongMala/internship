package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SchoolSubjectListRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
	constant.SubjectFilter
}

// ==================== Response ==========================

type SchoolSubjectListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolSubjectList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolSubjectListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	schoolSubjectListOutput, err := api.Service.SchoolSubjectList(&SchoolSubjectListInput{
		SchoolSubjectListRequest: request,
		Pagination:               pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolSubjectListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolSubjectListOutput.Subjects,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolSubjectListInput struct {
	Pagination *helper.Pagination
	*SchoolSubjectListRequest
}

type SchoolSubjectListOutput struct {
	Subjects []constant.SubjectEntity
}

func (service *serviceStruct) SchoolSubjectList(in *SchoolSubjectListInput) (*SchoolSubjectListOutput, error) {
	subjects, err := service.subjectTeacherStorage.SchoolSubjectList(in.SchoolId, in.SubjectFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolSubjectListOutput{
		Subjects: subjects,
	}, nil
}
