package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListLessonResponse struct {
	StatusCode int                     `json:"status_code"`
	Data       []constant.LessonEntity `json:"data"`
	Message    string                  `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListLesson(context *fiber.Ctx) error {
	userId := context.Params("userId")

	filter, err := helper.ParseAndValidateRequest(context, &constant.LessonFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studentCaseListLessonOutput, err := api.Service.StudentCaseListLesson(&StudentCaseListLessonInput{
		UserId: userId,
		Filter: filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListLessonResponse{
		StatusCode: http.StatusOK,
		Data:       studentCaseListLessonOutput.Lessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListLessonInput struct {
	UserId string
	Filter *constant.LessonFilter
}

type StudentCaseListLessonOutput struct {
	Lessons []constant.LessonEntity
}

func (service *serviceStruct) StudentCaseListLesson(in *StudentCaseListLessonInput) (*StudentCaseListLessonOutput, error) {
	lessons, err := service.adminSchoolStorage.StudentCaseListLesson(in.UserId, *in.Filter)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListLessonOutput{
		Lessons: lessons,
	}, nil
}
