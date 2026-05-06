package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassLessonCaseToggleRequest struct {
	ClassId   int   `params:"classId" validate:"required"`
	LessonId  int   `params:"lessonId" validate:"required"`
	IsEnabled *bool `json:"is_enabled" validate:"required"`
}

type ClassLessonCaseToggleResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassLessonCaseToggle(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassLessonCaseToggleRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ClassLessonCaseToggle(&ClassLessonCaseToggleInput{
		SubjectId:                    subjectId,
		ClassLessonCaseToggleRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassLessonCaseToggleResponse{
		StatusCode: http.StatusOK,
		Message:    "Toggled",
	})
}

// ==================== Service ==========================

type ClassLessonCaseToggleInput struct {
	SubjectId string
	*ClassLessonCaseToggleRequest
}

func (service *serviceStruct) ClassLessonCaseToggle(in *ClassLessonCaseToggleInput) error {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return err
	}

	err = service.teacherLessonStorage.ClassLessonCaseToggle(in.ClassId, in.LessonId, in.IsEnabled)
	if err != nil {
		return err
	}

	return nil
}
