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

type SubCriteriaTopicGetResponse struct {
	StatusCode int                               `json:"status_code"`
	Data       []constant.SubCriteriaTopicEntity `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubCriteriaTopicGet(context *fiber.Ctx) error {
	subCriteriaTopicId, err := context.ParamsInt("topicId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subCriteriaTopicGetOutput, err := api.Service.SubCriteriaTopicGet(&SubCriteriaTopicGetInput{
		SubCriteriaTopicId: subCriteriaTopicId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubCriteriaTopicGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubCriteriaTopicEntity{*subCriteriaTopicGetOutput.SubCriteriaTopicEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubCriteriaTopicGetInput struct {
	SubCriteriaTopicId int
}

type SubCriteriaTopicGetOutput struct {
	*constant.SubCriteriaTopicEntity
}

func (service *serviceStruct) SubCriteriaTopicGet(in *SubCriteriaTopicGetInput) (*SubCriteriaTopicGetOutput, error) {
	subCriteriaTopic, err := service.repositoryStorage.SubCriteriaTopicGet(in.SubCriteriaTopicId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &SubCriteriaTopicGetOutput{
		subCriteriaTopic,
	}, nil
}
