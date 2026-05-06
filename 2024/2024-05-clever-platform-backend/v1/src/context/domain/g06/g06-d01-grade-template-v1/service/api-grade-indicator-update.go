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
type GradeIndicatorUpdateRequest struct {
	ScoreEvaluationType *string                                    `json:"score_evaluation_type"`
	AssementSettings    []constant.TemplateAssessmentSettingEntity `json:"data"`
	SubjectId           string                                     `json:"-"`
	IndicatorId   int                                        `json:"-"`
}

// ==================== Response ==========================
type GradeIndicatorUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeIndicatorUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeIndicatorUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	indicatorId, err := context.ParamsInt("indicatorId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.SubjectId = subjectId
	request.IndicatorId = indicatorId
	err = api.Service.GradeIndicatorUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeIndicatorUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeIndicatorUpdate(in *GradeIndicatorUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	if in.ScoreEvaluationType != nil {
		err = service.gradeTemplateStorage.GradeIndicatorUpdate(sqlTx, &constant.TemplateIndicatorEntity{
			Id:                  &in.IndicatorId,
			ScoreEvaluationType: in.ScoreEvaluationType,
		})
		if err != nil {
			return err
		}
	}

	for _, assementSetting := range in.AssementSettings {
		if assementSetting.Id != nil {
			err = service.gradeTemplateStorage.GradeAssesmentSettingUpdate(sqlTx, &assementSetting)
			if err != nil {
				return err
			}
		} else {
			assementSetting.TemplateIndicatorId = &in.IndicatorId
			_, err = service.gradeTemplateStorage.GradeAssesmentSettingInsert(sqlTx, &assementSetting)
			if err != nil {
				return err
			}
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
