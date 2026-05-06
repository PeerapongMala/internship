package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type LearningContentGetResponse struct {
	StatusCode int                              `json:"status_code"`
	Data       []constant.LearningContentEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LearningContentGet(context *fiber.Ctx) error {
	learningContentId, err := context.ParamsInt("learningContentId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	learningContentGetOutput, err := api.Service.LearningContentGet(&LearningContentGetInput{
		LearningContentId: learningContentId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LearningContentGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.LearningContentEntity{*learningContentGetOutput.LearningContentEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LearningContentGetInput struct {
	LearningContentId int
}

type LearningContentGetOutput struct {
	*constant.LearningContentEntity
}

func (service *serviceStruct) LearningContentGet(in *LearningContentGetInput) (*LearningContentGetOutput, error) {
	learningContent, err := service.repositoryStorage.LearningContentGet(in.LearningContentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &LearningContentGetOutput{
		learningContent,
	}, nil
}
