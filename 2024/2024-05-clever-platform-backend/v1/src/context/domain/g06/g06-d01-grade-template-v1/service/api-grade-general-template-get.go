package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GradeGeneralTemplateGetResponse struct {
	StatusCode int                                   `json:"status_code"`
	Message    string                                `json:"message"`
	Data       []constant.GradeGeneralTemplateEntity `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeGeneralTemplateGet(context *fiber.Ctx) error {

	id, err := context.ParamsInt("id")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if id == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeGeneralTemplateGet(id)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeGeneralTemplateGetResponse{
		StatusCode: 200,
		Message:    "success",
		Data:       []constant.GradeGeneralTemplateEntity{*resp.GradeTemplate},
	})
}

// ==================== Service ==========================

type GradeGeneralTemplateGetOutput struct {
	GradeTemplate *constant.GradeGeneralTemplateEntity
}

func (service *serviceStruct) GradeGeneralTemplateGet(id int) (*GradeGeneralTemplateGetOutput, error) {

	gradeTemplate, err := service.gradeTemplateStorage.GradeGeneralTemplateGetById(id)
	if err != nil {
		return nil, err
	}

	return &GradeGeneralTemplateGetOutput{
		GradeTemplate: gradeTemplate,
	}, nil
}
