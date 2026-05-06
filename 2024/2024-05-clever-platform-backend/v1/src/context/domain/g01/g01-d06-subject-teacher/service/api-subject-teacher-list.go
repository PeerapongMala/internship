package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubjectTeacherListRequest struct {
	SchoolId  int `params:"schoolId" validate:"required"`
	SubjectId int `params:"subjectId" validate:"required"`
	constant.SubjectTeacherFilter
}

// ==================== Response ==========================

type SubjectTeacherListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.TeacherEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTeacherList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTeacherListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	subjectTeacherListOutput, err := api.Service.SubjectTeacherList(&SubjectTeacherListInput{
		Pagination:                pagination,
		SubjectTeacherListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTeacherListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       subjectTeacherListOutput.Teachers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectTeacherListInput struct {
	Pagination *helper.Pagination
	*SubjectTeacherListRequest
}

type SubjectTeacherListOutput struct {
	Teachers []constant.TeacherEntity
}

func (service *serviceStruct) SubjectTeacherList(in *SubjectTeacherListInput) (*SubjectTeacherListOutput, error) {
	teachers, err := service.subjectTeacherStorage.SubjectTeacherList(in.SchoolId, in.SubjectId, &in.SubjectTeacherFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SubjectTeacherListOutput{teachers}, nil
}
