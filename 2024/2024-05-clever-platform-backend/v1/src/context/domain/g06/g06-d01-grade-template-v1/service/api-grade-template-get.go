package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Response ==========================
type GradeTemplateGetResponse struct {
	Data       []gradeTemplateData `json:"data"`
	Message    string              `json:"message"`
	StatusCode int                 `json:"status_code"`
}
type gradeTemplateData struct {
	Template        constant.GradeTemplateEntity               `json:"template"`
	Subjects        []constant.SubjectEntity                   `json:"subjects"`
	GeneralTemplate []constant.TemplateGeneralEvaluationEntity `json:"general_templates"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateGet(context *fiber.Ctx) error {

	templateId, err := context.ParamsInt("gradeTemplateId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeTemplateGet(templateId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeTemplateGetResponse{
		Data: []gradeTemplateData{
			{
				Template:        resp.Template,
				Subjects:        resp.Subject,
				GeneralTemplate: resp.GeneralTemplate,
			},
		},
		StatusCode: http.StatusOK,
		Message:    "Success",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeTemplateGet(id int) (*constant.GradeTemplateWithSubject, error) {

	resp, err := service.gradeTemplateStorage.GradeTemplateGetById(id)
	if err != nil {
		return nil, err
	}

	return resp, nil
}