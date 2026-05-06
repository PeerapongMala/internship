package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeTemplateCreateRequest struct {
	Template        constant.GradeTemplateEntity               `json:"template"`
	Subjects        []constant.SubjectEntity                   `json:"subjects"`
	GeneralTemplate []constant.TemplateGeneralEvaluationEntity `json:"general_templates"`
	SubjectId       string                                     `json:"-"`
}

// ==================== Response ==========================
type GradeTemplateCreateResponse struct {
	constant.StatusResponse
	Data []gradeTemplateData `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeTemplateCreateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	resp, err := api.Service.GradeTemplateCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeTemplateCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: []gradeTemplateData{
			{
				Template:        resp.Template,
				Subjects:        resp.Subject,
				GeneralTemplate: resp.GeneralTemplate,
			},
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeTemplateCreate(in *GradeTemplateCreateRequest) (*constant.GradeTemplateWithSubject, error) {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	in.Template.CreatedAt = &now
	in.Template.UpdatedAt = &now
	in.Template.CreatedBy = &in.SubjectId
	in.Template.UpdatedBy = &in.SubjectId

	templateId, err := service.gradeTemplateStorage.GradeTemplateInsert(sqlTx, &in.Template)
	if err != nil {
		return nil, err
	}

	for _, subject := range in.Subjects {
		subject.TemplateId = &templateId
		subjectId, err := service.gradeTemplateStorage.GradeSubjectInsert(sqlTx, &subject)
		if err != nil {
			return nil, err
		}

		if subject.IsClever {
			subject.Id = &subjectId
			err = IsCleverDumpData(sqlTx, subject)
			if err != nil {
				return nil, err
			}
		}
	}

	for _, generalTemplate := range in.GeneralTemplate {
		generalTemplate.TemplateId = &templateId
		_, err = service.gradeTemplateStorage.GradeGeneralEvaluationInsert(sqlTx, &generalTemplate)
		if err != nil {
			return nil, err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return nil, err
	}

	resp, err := service.gradeTemplateStorage.GradeTemplateGetById(templateId)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
