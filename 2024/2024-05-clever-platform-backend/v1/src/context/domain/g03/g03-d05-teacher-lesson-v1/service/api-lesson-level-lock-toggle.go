package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LessonLevelLockToggleRequest struct {
	ClassId     int   `params:"classId" validate:"required"`
	SubLessonId int   `params:"subLessonId" validate:"required"`
	IsEnabled   *bool `json:"is_enabled" validate:"required"`
}

type LessonLevelLockToggleResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func (api *APIStruct) LessonLevelLockToggle(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonLevelLockToggleRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.LessonLevelLockToggle(&LessonLevelLockToggleInput{
		LessonLevelLockToggleRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonLevelLockToggleResponse{
		StatusCode: http.StatusOK,
		Message:    "Toggled",
	})
}

// ==================== Service ==========================

type LessonLevelLockToggleInput struct {
	*LessonLevelLockToggleRequest
}

func (service *serviceStruct) LessonLevelLockToggle(in *LessonLevelLockToggleInput) error {
	lock := !*in.IsEnabled
	err := service.teacherLessonStorage.LessonLevelToggle(in.SubLessonId, in.ClassId, &lock)
	if err != nil {
		return err
	}

	return nil
}
