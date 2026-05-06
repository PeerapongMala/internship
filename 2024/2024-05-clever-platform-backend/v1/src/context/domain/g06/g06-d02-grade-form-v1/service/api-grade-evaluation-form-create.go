package service

import (
	"log"
	"net/http"
	"time"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeEvaluationCreateRequest struct {
	*constant.GradeEvaluationFormEntity
	SubjectId string
}

// ==================== Response ==========================
type GradeEvaluationCreateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationCreateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if request.TemplateId == nil || *request.TemplateId == 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.SubjectId = subjectId
	data, err := api.Service.GradeEvaluationFormCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
			Data:       data,
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeEvaluationFormCreate(in *GradeEvaluationCreateRequest) (*constant.GradeEvaluationFormEntity, error) {

	sqlTx, err := service.gradeFormStorage.BeginTx()
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	evaluationFormID, err := service.gradeEvaluationFormCreate(sqlTx, now, in.SubjectId, in.GradeEvaluationFormEntity)
	if err != nil {
		return nil, err
	}

	err = sqlTx.Commit()
	if err != nil {
		return nil, err
	}

	evaluationForm, err := service.gradeFormStorage.GradeEvaluationFormGetById(evaluationFormID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err)) //ignore error
	}

	return evaluationForm, nil
}

func (service *serviceStruct) gradeEvaluationFormCreate(tx *sqlx.Tx, now time.Time, subjectId string, in *constant.GradeEvaluationFormEntity) (int, error) {
	in.CreatedAt = &now
	in.UpdatedAt = &now
	in.CreatedBy = &subjectId
	in.UpdatedBy = &subjectId

	if in.IsLock == nil {
		in.IsLock = &constant.False
	}

	var sheetList []*constant.EvaluationSheetEntity

	activeForm, err := service.gradeFormStorage.GradeEvaluationFormGetActiveByFilter(tx, helper.Deref(in.SchoolId), helper.Deref(in.AcademicYear), helper.Deref(in.Year), helper.Deref(in.SchoolRoom))
	if err != nil {
		return 0, err
	}
	if activeForm != nil {
		msg := "form already exists"
		log.Printf("school id %d, academic year %s, year %s, room %s is already active", helper.Deref(in.SchoolId), helper.Deref(in.AcademicYear), helper.Deref(in.Year), helper.Deref(in.SchoolRoom))
		return 0, helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	//get data from template
	subjectWithIndicatorTemplate, err := service.gradeTemplateStorage.GradeSubjectByTemplateId(*in.TemplateId)
	if err != nil {
		return 0, err
	}

	//get data list
	templateData, err := service.gradeTemplateStorage.GradeTemplateGetById(*in.TemplateId)
	if err != nil {
		return 0, err
	}

	//save data to evaluation_form
	evaluationFormId, err := service.gradeFormStorage.EvaluationFormInsert(tx, in)
	if err != nil {
		return 0, err
	}

	formSubjectIds := []int{}
	for _, subjectTemplate := range subjectWithIndicatorTemplate {
		evaluationFormSubjectId, err := service.gradeFormStorage.EvaluationFormSubjectInsert(tx, &constant.GradeEvaluationFormSubjectEntity{
			FormId:                  &evaluationFormId,
			SubjectTemplateId:       &subjectTemplate.SubjectId,
			CleverSubjectTemplateId: subjectTemplate.CleverSubjectTemplateId,
		})
		if err != nil {
			return 0, err
		}
		formSubjectIds = append(formSubjectIds, evaluationFormSubjectId)

		for _, indicatorTemplate := range subjectTemplate.Indicators {
			evaluationFormindicatorId, err := service.gradeFormStorage.EvaluationFormIndicatorInsert(tx, &constant.GradeEvaluationFormIndicatorEntity{
				EvaluationFormSubjectId:          &evaluationFormSubjectId,
				Name:                             &indicatorTemplate.IndicatorName,
				MaxValue:                         indicatorTemplate.MaxValue,
				Sort:                             &indicatorTemplate.Sort,
				ScoreEvaluationType:              indicatorTemplate.ScoreEvaluationType,
				CleverLessonId:                   indicatorTemplate.CleverLessonId,
				CleverSubLessonId:                indicatorTemplate.CleverSubLessonId,
				CleverSubjectTemplateIndicatorId: indicatorTemplate.CleverSubjectTemplateIndicatorId,
			})
			if err != nil {
				return 0, err
			}

			//get data from template
			settingTemplates, err := service.gradeTemplateStorage.GradeIndicatorWithAssesmentSettingByIndicatorId(*indicatorTemplate.Id)
			if err != nil {
				return 0, err
			}

			for _, setting := range settingTemplates.AssementSettings {
				_, err := service.gradeFormStorage.EvaluationFormSettingInsert(tx, &constant.GradeEvaluationFormSettingEntity{
					EvaluationFormIndicatorId: &evaluationFormindicatorId,
					EvaluationKey:             setting.EvaluationKey,
					EvaluationTopic:           setting.EvaluationTopic,
					Value:                     setting.Value,
					Weight:                    setting.Weight,
					LevelCount:                setting.LevelCount,
				})
				if err != nil {
					return 0, err
				}
			}
		}

		sheetList = append(sheetList, &constant.EvaluationSheetEntity{
			FormID:                            &evaluationFormId,
			ValueType:                         &constant.Subject,
			EvaluationFormSubjectID:           &evaluationFormSubjectId,
			EvaluationFormGeneralEvaluationID: nil,
			IsLock:                            &constant.False,
			Status:                            &constant.ESDraft,
			CreatedAt:                         &now,
			CreatedBy:                         &subjectId,
			UpdatedAt:                         &now,
			UpdatedBy:                         &subjectId,
			AdminLoginAs:                      nil,
		})
	}

	//dump data from template -> general-evaluation
	for _, generalTemplate := range templateData.GeneralTemplate {
		if generalTemplate.TemplateType == string(constant2.DesirableTraits) ||
			generalTemplate.TemplateType == string(constant2.Competency) ||
			generalTemplate.TemplateType == string(constant2.StudentDevelopment) ||
			generalTemplate.TemplateType == string(constant2.Attendance) {

			for _, formSubjectId := range formSubjectIds {
				id, err := service.gradeFormStorage.EvaluationFormGeneralEvaluationInsert(tx, &constant.GradeEvaluationFormGeneralEvaluationEntity{
					FormId:                      &evaluationFormId,
					TemplateType:                &generalTemplate.TemplateType,
					TemplateName:                &generalTemplate.TemplateName,
					AdditionalData:              generalTemplate.AdditionalData,
					TemplateGeneralEvaluationID: generalTemplate.Id,
				})
				if err != nil {
					return 0, err
				}

				sheetList = append(sheetList, &constant.EvaluationSheetEntity{
					FormID:                            &evaluationFormId,
					ValueType:                         &constant.General,
					EvaluationFormSubjectID:           &formSubjectId,
					EvaluationFormGeneralEvaluationID: &id,
					IsLock:                            &constant.False,
					Status:                            &constant.ESDraft,
					CreatedAt:                         &now,
					CreatedBy:                         &subjectId,
					UpdatedAt:                         &now,
					UpdatedBy:                         &subjectId,
					AdminLoginAs:                      nil,
				})
			}
		} else {
			id, err := service.gradeFormStorage.EvaluationFormGeneralEvaluationInsert(tx, &constant.GradeEvaluationFormGeneralEvaluationEntity{
				FormId:                      &evaluationFormId,
				TemplateType:                &generalTemplate.TemplateType,
				TemplateName:                &generalTemplate.TemplateName,
				AdditionalData:              generalTemplate.AdditionalData,
				TemplateGeneralEvaluationID: generalTemplate.Id,
			})
			if err != nil {
				return 0, err
			}

			sheetList = append(sheetList, &constant.EvaluationSheetEntity{
				FormID:                            &evaluationFormId,
				ValueType:                         &constant.General,
				EvaluationFormSubjectID:           nil,
				EvaluationFormGeneralEvaluationID: &id,
				IsLock:                            &constant.False,
				Status:                            &constant.ESDraft,
				CreatedAt:                         &now,
				CreatedBy:                         &subjectId,
				UpdatedAt:                         &now,
				UpdatedBy:                         &subjectId,
				AdminLoginAs:                      nil,
			})
		}
	}

	err = service.gradeFormStorage.EvaluationSheetInsert(tx, sheetList)
	if err != nil {
		return 0, err
	}

	return evaluationFormId, nil
}
