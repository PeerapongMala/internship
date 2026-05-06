package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type UnlockedStudyGroupCaseBulkEditRequest struct {
	LevelId       int   `params:"levelId" validate:"required"`
	StudyGroupIds []int `json:"study_group_ids" validate:"required"`
}

// ==================== Response ==========================

type UnlockedStudyGroupCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UnlockedStudyGroupCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &UnlockedStudyGroupCaseBulkEditRequest{}, helper.ParseOptions{
		Params: true,
		Body:   true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.UnlockedStudyGroupCaseBulkEdit(&UnlockedStudyGroupCaseBulkEditInput{
		UnlockedStudyGroupCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UnlockedStudyGroupCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type UnlockedStudyGroupCaseBulkEditInput struct {
	*UnlockedStudyGroupCaseBulkEditRequest
}

func (service *serviceStruct) UnlockedStudyGroupCaseBulkEdit(in *UnlockedStudyGroupCaseBulkEditInput) error {
	err := service.teacherLessonStorage.UnlockedStudyGroupCaseBulkDelete(in.LevelId, in.StudyGroupIds)
	if err != nil {
		return err
	}

	return nil
}
