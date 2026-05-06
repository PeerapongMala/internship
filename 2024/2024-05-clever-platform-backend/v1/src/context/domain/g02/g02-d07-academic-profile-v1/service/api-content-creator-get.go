package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ContentCreatorGetResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) ContentCreatorGet(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contentCreatorGetOutput, err := api.Service.ContentCreatorGet(&ContentCreatorGetInput{
		ContentCreatorId: subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContentCreatorGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.UserEntity{*contentCreatorGetOutput.UserEntity},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ContentCreatorGetInput struct {
	ContentCreatorId string
}

type ContentCreatorGetOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) ContentCreatorGet(in *ContentCreatorGetInput) (*ContentCreatorGetOutput, error) {
	contentCreator, err := service.academicProfileStorage.UserGet(in.ContentCreatorId)
	if err != nil {
		return nil, err
	}

	if contentCreator.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*contentCreator.ImageUrl)
		if err != nil {
			return nil, err
		}
		contentCreator.ImageUrl = url
	}

	return &ContentCreatorGetOutput{
		contentCreator,
	}, nil
}
