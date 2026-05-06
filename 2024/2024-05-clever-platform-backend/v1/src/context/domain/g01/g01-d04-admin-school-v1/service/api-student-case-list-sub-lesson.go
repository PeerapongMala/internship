package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentCaseListSubLessonResponse struct {
	StatusCode int                        `json:"status_code"`
	Data       []constant.SubLessonEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseListSubLesson(context *fiber.Ctx) error {
	userId := context.Params("userId")

	filter, err := helper.ParseAndValidateRequest(context, &constant.SubLessonFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studentCaseListSubLessonOutput, err := api.Service.StudentCaseListSubLesson(&StudentCaseListSubLessonInput{
		UserId: userId,
		Filter: filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseListSubLessonResponse{
		StatusCode: http.StatusOK,
		Data:       studentCaseListSubLessonOutput.SubLessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type StudentCaseListSubLessonInput struct {
	UserId string
	Filter *constant.SubLessonFilter
}

type StudentCaseListSubLessonOutput struct {
	SubLessons []constant.SubLessonEntity
}

func (service *serviceStruct) StudentCaseListSubLesson(in *StudentCaseListSubLessonInput) (*StudentCaseListSubLessonOutput, error) {
	subLessons, err := service.adminSchoolStorage.StudentCaseListSubLesson(in.UserId, in.Filter)
	if err != nil {
		return nil, err
	}

	return &StudentCaseListSubLessonOutput{
		SubLessons: subLessons,
	}, nil
}
