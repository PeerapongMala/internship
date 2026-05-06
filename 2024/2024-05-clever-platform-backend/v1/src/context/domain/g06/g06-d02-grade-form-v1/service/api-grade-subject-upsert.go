package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeSubjectUpsertRequest struct {
	EvaluationFormId int                                                 `params:"evaluationFormId"`
	Data             []constant.GradeEvaluationFormSubjectWithNameEntity `json:"data" validate:"required"`
	SubjectId        string
}

// ==================== Response ==========================
type GradeSubjectUpsertResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeSubjectUpsert(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeSubjectUpsertRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	id, err := context.ParamsInt("evaluationFormId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if id == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.GradeSubjectUpsert(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeSubjectUpsertResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeSubjectUpsert(in *GradeSubjectUpsertRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	//now := time.Now().UTC()

	activeSubjectIds := []int{}
	sheetList := []*constant.EvaluationSheetEntity{}
	for i, data := range in.Data {
		if data.GradeEvaluationSubjectId != nil {
			err := service.gradeFormStorage.EvaluationFormSubjectUpdate(sqlTx, helper.Deref(data.GradeEvaluationSubjectId), data.CleverSubjectTemplateId, data.SubjectNo, data.LearningArea, data.Credits, data.IsExtra, data.SubjectName, data.IsClever, data.CleverSubjectId, data.Hours)
			if err != nil {
				return err
			}
		} else {
			id, err := service.gradeFormStorage.EvaluationFormSubjectInsert(sqlTx, &constant.GradeEvaluationFormSubjectEntity{
				FormId:                  data.FormId,
				SubjectTemplateId:       data.GradeEvaluationSubjectTemplateId,
				CleverSubjectTemplateId: data.CleverSubjectTemplateId,
				SubjectNo:               data.SubjectNo,
				LearningArea:            data.LearningArea,
				Credits:                 data.Credits,
				IsExtra:                 data.IsExtra,
				SubjectName:             data.SubjectName,
				IsClever:                data.IsClever,
				CleverSubjectId:         data.CleverSubjectId,
				Hours:                   data.Hours,
			})
			if err != nil {
				return err
			}
			data.GradeEvaluationSubjectId = &id
			sheetList = append(sheetList, &constant.EvaluationSheetEntity{
				FormID:                            &in.EvaluationFormId,
				ValueType:                         &constant.Subject,
				EvaluationFormSubjectID:           &id,
				EvaluationFormGeneralEvaluationID: nil,
				IsLock:                            &constant.False,
				Status:                            &constant.ESDraft,
				CreatedAt:                         helper.ToPtr(time.Now().UTC()),
				CreatedBy:                         &in.SubjectId,
				UpdatedAt:                         helper.ToPtr(time.Now().UTC()),
				UpdatedBy:                         &in.SubjectId,
				AdminLoginAs:                      nil,
			})
		}
		activeSubjectIds = append(activeSubjectIds, helper.Deref(data.GradeEvaluationSubjectId))

		var activeIndicatorID []int
		for j, indicator := range data.Indicator {
			if indicator.EvaluationFormSubjectId == nil {
				indicator.EvaluationFormSubjectId = data.GradeEvaluationSubjectId
			}
			indicatorId, err := service.gradeFormStorage.EvaluationFormIndicatorUpsert(sqlTx, indicator)
			if err != nil {
				log.Printf("upsert indicator at index data %v, indicator %v have error: %v", i, j, err)
				return err
			}
			for k, setting := range indicator.Setting {
				if setting.EvaluationFormIndicatorId == nil {
					setting.EvaluationFormIndicatorId = &indicatorId
				}
				_, err = service.gradeFormStorage.EvaluationFormSettingUpsert(sqlTx, setting)
				if err != nil {
					log.Printf("upsert indicator at index data %v, indicator %v, setting %v have error: %v", i, j, k, err)
					return err
				}
			}
			activeIndicatorID = append(activeIndicatorID, indicatorId)
		}

		if data.GradeEvaluationSubjectId != nil {
			err = service.gradeFormStorage.DeleteGradeEvaluationIndicatorAndSettingNotActive(sqlTx, *data.GradeEvaluationSubjectId, activeIndicatorID)
			if err != nil {
				log.Printf("DeleteGradeEvaluationIndicatorAndSettingNotActive %+v", errors.WithStack(err))
				return err
			}
		}
	}

	err = service.gradeFormStorage.GradeEvaluationSubjectNotActiveDelete(sqlTx, activeSubjectIds, in.EvaluationFormId)
	if err != nil {
		return err
	}

	err = service.gradeFormStorage.EvaluationSheetInsert(sqlTx, sheetList)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
