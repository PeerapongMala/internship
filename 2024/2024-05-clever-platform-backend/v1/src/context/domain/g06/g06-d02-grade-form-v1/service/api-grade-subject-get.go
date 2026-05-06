package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GradeSubjectGetResponse struct {
	StatusCode int                                                 `json:"status_code"`
	Data       []constant.GradeEvaluationFormSubjectWithNameEntity `json:"data"`
	Message    string                                              `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeSubjectGet(context *fiber.Ctx) error {

	evaluationFormId, err := context.ParamsInt("evaluationFormId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if evaluationFormId == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeSubjectGet(evaluationFormId)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeSubjectGetResponse{
		StatusCode: http.StatusOK,
		Data:       resp.Resp,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type GradeSubjectGetOutput struct {
	Resp []constant.GradeEvaluationFormSubjectWithNameEntity
}

func (service *serviceStruct) GradeSubjectGet(id int) (*GradeSubjectGetOutput, error) {

	resp, err := service.gradeFormStorage.GradeEvaluationSubjectGetByFormId(id, true)
	if err != nil {
		return nil, err
	}

	return &GradeSubjectGetOutput{
		Resp: resp,
	}, nil
}
