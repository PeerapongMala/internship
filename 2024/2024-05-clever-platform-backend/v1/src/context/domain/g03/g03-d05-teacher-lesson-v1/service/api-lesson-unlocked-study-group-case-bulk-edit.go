package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonUnlockedStudyGroupCaseBulkEditRequest struct {
	LessonId      int   `params:"lessonId" validate:"required"`
	StudyGroupIds []int `json:"study_group_ids" validate:"required"`
}

// ==================== Response ==========================

type LessonUnlockedStudyGroupCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonUnlockedStudyGroupCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonUnlockedStudyGroupCaseBulkEditRequest{}, helper.ParseOptions{
		Params: true,
		Body:   true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.LessonUnlockedStudyGroupCaseBulkEdit(&LessonUnlockedStudyGroupCaseBulkEditInput{
		LessonUnlockedStudyGroupCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonUnlockedStudyGroupCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LessonUnlockedStudyGroupCaseBulkEditInput struct {
	*LessonUnlockedStudyGroupCaseBulkEditRequest
}

func (service *serviceStruct) LessonUnlockedStudyGroupCaseBulkEdit(in *LessonUnlockedStudyGroupCaseBulkEditInput) error {
	err := service.teacherLessonStorage.LessonUnlockedStudyGroupBulkDelete(in.LessonId, in.StudyGroupIds)
	if err != nil {
		return err
	}

	return nil
}
