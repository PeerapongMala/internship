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

type LearningAreaGetResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       []constant.LearningAreaEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LearningAreaGet(context *fiber.Ctx) error {
	learningAreaId, err := context.ParamsInt("learningAreaId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	learningAreaGetOutput, err := api.Service.LearningAreaGet(&LearningAreaGetInput{
		LearningAreaId: learningAreaId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LearningAreaGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.LearningAreaEntity{*learningAreaGetOutput.LearningAreaEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LearningAreaGetInput struct {
	LearningAreaId int
}

type LearningAreaGetOutput struct {
	*constant.LearningAreaEntity
}

func (service *serviceStruct) LearningAreaGet(in *LearningAreaGetInput) (*LearningAreaGetOutput, error) {
	learningArea, err := service.repositoryStorage.LearningAreaGet(in.LearningAreaId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &LearningAreaGetOutput{
		learningArea,
	}, nil
}
