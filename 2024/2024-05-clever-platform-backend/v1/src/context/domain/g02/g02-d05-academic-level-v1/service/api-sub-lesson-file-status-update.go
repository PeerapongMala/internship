package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SubLessonFileStatusUpdateRequest struct {
	SubLessonIds    []int `json:"sub_lesson_ids" validate:"required"`
	EmbeddedFile    bool  `json:"embedded_file"`
	LevelFile       bool  `json:"level_file"`
	GroupLevelFiles bool  `json:"group_level_files"`
}

// ==================== Response ==========================

type SubLessonFileStatusUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonFileStatusUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonFileStatusUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SubLessonFileStatusUpdate(&SubLessonFileStatusUpdateInput{
		SubjectId:                        subjectId,
		SubLessonFileStatusUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonFileStatusUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type SubLessonFileStatusUpdateInput struct {
	SubjectId string
	*SubLessonFileStatusUpdateRequest
}

func (service *serviceStruct) SubLessonFileStatusUpdate(in *SubLessonFileStatusUpdateInput) error {
	for _, subLessonId := range in.SubLessonIds {
		err := service.UpdateSubLessonFile(&UpdateSubLessonFileInput{
			subjectId:       in.SubjectId,
			subLessonId:     subLessonId,
			EmbeddedFile:    in.EmbeddedFile,
			LevelFile:       in.LevelFile,
			GroupLevelFiles: in.GroupLevelFiles,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
