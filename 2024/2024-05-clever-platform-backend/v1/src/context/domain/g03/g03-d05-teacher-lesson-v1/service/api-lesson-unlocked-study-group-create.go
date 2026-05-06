package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonUnlockedForStudyGroupCreateRequest struct {
	ClassId       int   `params:"classId" validate:"required"`
	LessonId      int   `params:"lessonId" validate:"required"`
	StudyGroupIds []int `json:"study_group_ids"`
}

// ==================== Response ==========================

type LessonUnlockedForStudyGroupCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonUnlockedForStudyGroupCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonUnlockedForStudyGroupCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LessonUnlockedForStudyGroupCreate(&LessonUnlockedForStudyGroupCreateInput{
		SubjectId:                                subjectId,
		LessonUnlockedForStudyGroupCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(LessonUnlockedForStudyGroupCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Study-group added",
	})
}

// ==================== Service ==========================

type LessonUnlockedForStudyGroupCreateInput struct {
	SubjectId string
	*LessonUnlockedForStudyGroupCreateRequest
}

func (service *serviceStruct) LessonUnlockedForStudyGroupCreate(in *LessonUnlockedForStudyGroupCreateInput) error {
	err := service.teacherLessonStorage.LessonUnlockedForStudyGroupCreate(in.LessonId, in.StudyGroupIds)
	if err != nil {
		return err
	}
	return nil
}
