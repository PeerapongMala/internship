package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LearningSublessonGetResponse struct {
	StatusCode int                                   `json:"status_code"`
	Data       *constant.LearningSublessonDataEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LearningSubessonGet(context *fiber.Ctx) error {
	sublessonId, err := context.ParamsInt("sublessonId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	response, err := api.Service.LearningSubessonGet(sublessonId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(LearningSublessonGetResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "Learning lesson Get",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) LearningSubessonGet(sublessonId int) (*constant.LearningSublessonDataEntity, error) {
	resp, err := service.learningLessonStorage.GetLearningSublesson(sublessonId)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
