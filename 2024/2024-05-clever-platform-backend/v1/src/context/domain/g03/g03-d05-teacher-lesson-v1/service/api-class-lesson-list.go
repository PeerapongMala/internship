package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassLessonListRequest struct {
	ClassId int `params:"classId" validate:"required"`
	constant.ClassLessonFilter
}

// ==================== Response ==========================

type ClassLessonListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.ClassLessonEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassLessonList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &ClassLessonListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classLessonListOutput, err := api.Service.ClassLessonList(&ClassLessonListInput{
		Pagination:             pagination,
		SubjectId:              subjectId,
		ClassLessonListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassLessonListResponse{StatusCode: http.StatusOK, Pagination: pagination, Data: classLessonListOutput.ClassLessons, Message: "Data retrieved"})
}

// ==================== Service ==========================

type ClassLessonListInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*ClassLessonListRequest
}

type ClassLessonListOutput struct {
	ClassLessons []constant.ClassLessonEntity
}

func (service *serviceStruct) ClassLessonList(in *ClassLessonListInput) (*ClassLessonListOutput, error) {
	classLessons, err := service.teacherLessonStorage.ClassLessonList(in.SubjectId, in.ClassId, in.ClassLessonFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ClassLessonListOutput{ClassLessons: classLessons}, nil
}
