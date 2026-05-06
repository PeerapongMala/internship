package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassSubLessonCaseToggleRequest struct {
	ClassId     int   `params:"classId" validate:"required"`
	SubLessonId int   `params:"subLessonId" validate:"required"`
	IsEnabled   *bool `json:"is_enabled" validate:"required"`
}

type ClassSubLessonCaseToggleResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassSubLessonCaseToggle(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassSubLessonCaseToggleRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ClassSubLessonCaseToggle(&ClassSubLessonCaseToggleInput{
		SubjectId:                       subjectId,
		ClassSubLessonCaseToggleRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassSubLessonCaseToggleResponse{
		StatusCode: http.StatusOK,
		Message:    "Toggled",
	})
}

// ==================== Service ==========================

type ClassSubLessonCaseToggleInput struct {
	SubjectId string
	*ClassSubLessonCaseToggleRequest
}

func (service *serviceStruct) ClassSubLessonCaseToggle(in *ClassSubLessonCaseToggleInput) error {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return err
	}

	err = service.teacherLessonStorage.ClassSubLessonCaseToggle(in.ClassId, in.SubLessonId, in.IsEnabled)
	if err != nil {
		return err
	}

	return nil
}
