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

type ContentGetResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.ContentEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ContentGet(context *fiber.Ctx) error {
	contentId, err := context.ParamsInt("contentId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	contentGetOutput, err := api.Service.ContentGet(&ContentGetInput{
		ContentId: contentId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContentGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.ContentEntity{*contentGetOutput.ContentEntity},
		Message:    "Data retrieved",
	})

}

// ==================== Service ==========================

type ContentGetInput struct {
	ContentId int
}

type ContentGetOutput struct {
	*constant.ContentEntity
}

func (service *serviceStruct) ContentGet(in *ContentGetInput) (*ContentGetOutput, error) {
	contentEntity, err := service.repositoryStorage.ContentGet(in.ContentId)
	if err != nil {
		return nil, err
	}

	return &ContentGetOutput{
		contentEntity,
	}, nil
}
