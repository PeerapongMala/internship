package service

import (
	"log"
	"net/http"
	"time"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeEvaluationFormCloneTemplateRequest struct {
	FormId int    `params:"formId" validate:"required"`
	Name   string `json:"name" validate:"required"`
}

// ==================== Response ==========================
type GradeEvaluationFormCloneTemplateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormCloneTemplate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationFormCloneTemplateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.GradeEvaluationFormCloneTemplate(&GradeEvaluationFormCloneTemplateInput{
		GradeEvaluationFormCloneTemplateRequest: request,
		SubjectId:                               subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

type GradeEvaluationFormCloneTemplateInput struct {
	*GradeEvaluationFormCloneTemplateRequest
	SubjectId string
	IsPublic  bool
}

// ==================== Service ==========================
func (service *serviceStruct) GradeEvaluationFormCloneTemplate(in *GradeEvaluationFormCloneTemplateInput) error {
	form, err := service.gradeFormStorage.GradeEvaluationFormGetById(in.FormId)
	if err != nil {
		return err
	}

	template, err := service.gradeTemplateStorage.GradeTemplateGetById(helper.Deref(form.TemplateId))
	if err != nil {
		return err
	}

	tx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	template.Template.CreatedAt = helper.ToPtr(time.Now().UTC())
	template.Template.CreatedBy = &in.SubjectId
	template.Template.UpdatedAt = nil
	template.Template.UpdatedBy = nil
	if in.Name != "" {
		template.Template.TemplateName = in.Name
	}
	if in.IsPublic {
		template.Template.SchoolId = helper.ToPtr(0)
	}
	newTemplateId, err := service.gradeTemplateStorage.GradeTemplateInsert(tx, &template.Template)
	if err != nil {
		return err
	}

	for _, generalTemplate := range template.GeneralTemplate {
		generalTemplate.TemplateId = &newTemplateId
		_, err := service.gradeTemplateStorage.GradeGeneralEvaluationInsert(tx, &generalTemplate)
		if err != nil {
			return err
		}
	}

	subjectWithIndicators, err := service.gradeFormStorage.GradeEvaluationSubjectGetByFormId(in.FormId, true)
	if err != nil {
		return err
	}
	subjectIndicatorsMap := map[int][]*constant.GradeEvaluationFormIndicatorEntity{}
	for _, subjectWithIndicator := range subjectWithIndicators {
		subjectIndicatorsMap[helper.Deref(subjectWithIndicator.GradeEvaluationSubjectTemplateId)] = subjectWithIndicator.Indicator
	}

	for _, subject := range template.Subject {
		indicators := subjectIndicatorsMap[helper.Deref(subject.Id)]
		subject.TemplateId = &newTemplateId
		newSubjectId, err := service.gradeTemplateStorage.GradeSubjectInsert(tx, &subject)
		if err != nil {
			return err
		}

		for _, indicator := range indicators {
			id, err := service.gradeTemplateStorage.GradeIndicatorInsert(tx, &constant2.TemplateIndicatorEntity{
				CleverSubjectTemplateIndicatorId: indicator.CleverSubjectTemplateIndicatorId,
				TemplateSubjectId:                newSubjectId,
				IndicatorName:                    helper.Deref(indicator.Name),
				MaxValue:                         indicator.MaxValue,
				Sort:                             helper.Deref(indicator.Sort),
				ScoreEvaluationType:              indicator.ScoreEvaluationType,
				CleverLessonId:                   indicator.CleverLessonId,
				CleverSubLessonId:                indicator.CleverSubLessonId,
			})
			if err != nil {
				return err
			}
			indicator.Id = &id

			for _, setting := range indicator.Setting {
				_, err = service.gradeTemplateStorage.GradeAssesmentSettingInsert(tx, &constant2.TemplateAssessmentSettingEntity{
					TemplateIndicatorId: indicator.Id,
					EvaluationKey:       setting.EvaluationKey,
					EvaluationTopic:     setting.EvaluationTopic,
					Value:               setting.Value,
					Weight:              setting.Weight,
					LevelCount:          setting.LevelCount,
				})
				if err != nil {
					return err
				}
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
