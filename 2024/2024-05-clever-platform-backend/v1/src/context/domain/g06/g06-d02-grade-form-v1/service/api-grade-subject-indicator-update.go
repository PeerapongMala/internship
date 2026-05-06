package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type GradeSubjectIndicatorUpdateRequest struct {
	IndicatorId int `params:"indicatorId" validate:"required"`
	*constant.GradeEvaluationFormIndicatorEntity
}

// ==================== Response ==========================
type GradeSubjectIndicatorUpdateResponse struct {
	constant.StatusResponse
	Data []constant.GradeEvaluationFormIndicatorEntity `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeSubjectIndicatorUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeSubjectIndicatorUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	indicator, err := api.Service.GradeSubjectIndicatorUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeSubjectIndicatorUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: []constant.GradeEvaluationFormIndicatorEntity{helper.Deref(indicator)},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeSubjectIndicatorUpdate(in *GradeSubjectIndicatorUpdateRequest) (*constant.GradeEvaluationFormIndicatorEntity, error) {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return nil, err
	}

	indicatorId, err := service.gradeFormStorage.EvaluationFormIndicatorUpsert(sqlTx, in.GradeEvaluationFormIndicatorEntity)
	if err != nil {
		return nil, err
	}
	for _, setting := range in.GradeEvaluationFormIndicatorEntity.Setting {
		if setting.EvaluationFormIndicatorId == nil {
			setting.EvaluationFormIndicatorId = &indicatorId
		}
		_, err = service.gradeFormStorage.EvaluationFormSettingUpsert(sqlTx, setting)
		if err != nil {
			return nil, err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return nil, err
	}

	indicator, err := service.gradeFormStorage.GradeEvaluationIndicatorGet(in.IndicatorId)
	if err != nil {
		return nil, err
	}

	return indicator, nil
}
