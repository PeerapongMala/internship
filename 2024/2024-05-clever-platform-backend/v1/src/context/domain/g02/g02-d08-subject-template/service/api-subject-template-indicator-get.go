package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SubjectTemplateIndicatorGetRequest struct {
	Id int `params:"indicatorId" validate:"required"`
}

// ==================== Response ==========================

type SubjectTemplateIndicatorGetResponse struct {
	StatusCode int                                       `json:"status_code"`
	Data       []constant.SubjectTemplateIndicatorEntity `json:"data"`
	Message    string                                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTemplateIndicatorGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTemplateIndicatorGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectTemplateListOutput, err := api.Service.SubjectTemplateIndicatorGet(&SubjectTemplateIndicatorGetInput{
		SubjectTemplateIndicatorGetRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTemplateIndicatorGetResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubjectTemplateIndicatorEntity{*subjectTemplateListOutput.Indicator},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubjectTemplateIndicatorGetInput struct {
	*SubjectTemplateIndicatorGetRequest
}

type SubjectTemplateIndicatorGetOutput struct {
	Indicator *constant.SubjectTemplateIndicatorEntity
}

func (service *serviceStruct) SubjectTemplateIndicatorGet(in *SubjectTemplateIndicatorGetInput) (*SubjectTemplateIndicatorGetOutput, error) {
	indicator, err := service.subjectTemplateStorage.SubjectTemplateIndicatorGet(in.Id)
	if err != nil {
		return nil, err
	}
	return &SubjectTemplateIndicatorGetOutput{
		Indicator: indicator,
	}, nil
}
