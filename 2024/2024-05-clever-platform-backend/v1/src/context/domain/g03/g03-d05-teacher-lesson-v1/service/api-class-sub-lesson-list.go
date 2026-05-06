package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassSubLessonListRequest struct {
	ClassId int `params:"classId" validate:"required"`
	constant.ClassSubLessonFilter
}

// ==================== Response ==========================

type ClassSubLessonListResponse struct {
	StatusCode int                             `json:"status_code"`
	Pagination *helper.Pagination              `json:"_pagination"`
	Data       []constant.ClassSubLessonEntity `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassSubLessonList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &ClassSubLessonListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classSubLessonOutput, err := api.Service.ClassSubLessonList(&ClassSubLessonInput{
		Pagination:                pagination,
		SubjectId:                 subjectId,
		ClassSubLessonListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassSubLessonListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       classSubLessonOutput.ClassSubLessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassSubLessonInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*ClassSubLessonListRequest
}

type ClassSubLessonOutput struct {
	ClassSubLessons []constant.ClassSubLessonEntity
}

func (service *serviceStruct) ClassSubLessonList(in *ClassSubLessonInput) (*ClassSubLessonOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	classSubLessons, err := service.teacherLessonStorage.ClassSubLessonList(in.ClassId, in.ClassSubLessonFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ClassSubLessonOutput{classSubLessons}, nil
}
