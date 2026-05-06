package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LearningLessonGetResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       constant.LearningLessonEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LearningLessonGet(context *fiber.Ctx) error {
	lessonId, err := context.ParamsInt("lessonId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	response, err := api.Service.LearningLessonGet(lessonId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(LearningLessonGetResponse{
		StatusCode: fiber.StatusOK,
		Data:       *response,
		Message:    "Learning lesson Get",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) LearningLessonGet(lessonId int) (*constant.LearningLessonEntity, error) {
	resp, err := service.learningLessonStorage.GetLearningLesson(lessonId)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
