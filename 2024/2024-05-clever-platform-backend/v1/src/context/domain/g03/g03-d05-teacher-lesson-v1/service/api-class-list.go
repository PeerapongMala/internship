package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassListRequest struct {
	constant.ClassFilter
}

// ==================== Response ==========================

type ClassListResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.ClassEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &ClassListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classListOutput, err := api.Service.ClassList(&ClassListInput{
		Pagination:       pagination,
		SubjectId:        subjectId,
		ClassListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       classListOutput.Classes,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*ClassListRequest
}

type ClassListOutput struct {
	Classes []constant.ClassEntity
}

func (service *serviceStruct) ClassList(in *ClassListInput) (*ClassListOutput, error) {
	var classes []constant.ClassEntity
	if in.StudentId == "" {
		in.ClassFilter.TeacherId = in.SubjectId
		teacherClasses, err := service.teacherLessonStorage.ClassList(&in.ClassFilter, in.Pagination)
		if err != nil {
			return nil, err
		}
		classes = teacherClasses
	} else {
		parentClasses, err := service.teacherLessonStorage.StudentClassList(&in.ClassFilter, in.Pagination)
		if err != nil {
			return nil, err
		}
		classes = parentClasses
	}

	return &ClassListOutput{classes}, nil
}
