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
type GradeTemplateUpdateDetailRequest struct {
	Template        constant.GradeTemplateEntity               `json:"template"`
	Subjects        []constant.SubjectEntity                   `json:"subjects"`
	GeneralTemplate []constant.TemplateGeneralEvaluationEntity `json:"general_templates"`
	SubjectId       string                                     `json:"-"`
}

// ==================== Response ==========================
type GradeTemplateUpdateDetailResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateUpdateDetail(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeTemplateUpdateDetailRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	templateId, err := context.ParamsInt("gradeTemplateId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.Template.Id = &templateId
	request.SubjectId = subjectId
	err = api.Service.GradeTemplateUpdateDetail(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeTemplateUpdateDetailResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeTemplateUpdateDetail(in *GradeTemplateUpdateDetailRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	in.Template.UpdatedAt = &now
	in.Template.UpdatedBy = &in.SubjectId

	err = service.gradeTemplateStorage.GradeTemplateUpdate(sqlTx, &in.Template)
	if err != nil {
		return err
	}

	var activeSubjectIDs []int
	var activeGeneralTemplateIDs []int

	for _, subject := range in.Subjects {
		if subject.Id != nil {
			err = service.gradeTemplateStorage.GradeSubjectUpdate(sqlTx, &subject)
			if err != nil {
				return err
			}
		} else {
			subject.TemplateId = in.Template.Id
			id, err := service.gradeTemplateStorage.GradeSubjectInsert(sqlTx, &subject)
			if err != nil {
				return err
			}
			subject.Id = &id
		}
		activeSubjectIDs = append(activeSubjectIDs, *subject.Id)
	}
	err = service.gradeTemplateStorage.DeleteGradeSubjectNotActive(sqlTx, *in.Template.Id, activeSubjectIDs)
	if err != nil {
		return err
	}

	for _, generalTemplate := range in.GeneralTemplate {
		if generalTemplate.Id != nil {
			err = service.gradeTemplateStorage.GradeGeneralEvaluationUpdate(sqlTx, &generalTemplate)
			if err != nil {
				return err
			}
		} else {
			generalTemplate.TemplateId = in.Template.Id
			id, err := service.gradeTemplateStorage.GradeGeneralEvaluationInsert(sqlTx, &generalTemplate)
			if err != nil {
				return err
			}
			generalTemplate.Id = &id
		}
		activeGeneralTemplateIDs = append(activeGeneralTemplateIDs, *generalTemplate.Id)
	}
	err = service.gradeTemplateStorage.DeleteGradeTemplateNotActive(sqlTx, *in.Template.Id, activeGeneralTemplateIDs)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
