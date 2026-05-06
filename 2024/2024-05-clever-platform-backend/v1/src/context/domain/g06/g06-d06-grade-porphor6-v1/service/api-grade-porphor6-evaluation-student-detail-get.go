package service

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================
type GradePorphor6Response struct {
	Porphor6Data       *constant.Porphor6DataResponse      `json:"porphor6_data"`
	EvaluationFormData *constant.GradeEvaluationFormEntity `json:"evaluation_form_data"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) GradePorphor6GetById(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	evaluationId := context.Params("evaluationFormId")

	resp, err := api.Service.GradPorphor6GetById(studentId, evaluationId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(resp)
}

// ==================== Service ==========================
func (service *serviceStruct) GradPorphor6GetById(studentId string, evaluationId string) (*GradePorphor6Response, error) {

	evaluation, err := service.gradePorphor6Storage.GradPorphor6EvaluationformGet(evaluationId)
	if err != nil {
		return nil, err
	}

	porphor6, err := service.gradePorphor6Storage.GradPorphor6GetByStudentId(studentId)
	if err != nil {
		return nil, err
	}

	var dataJSON map[string]interface{}
	if porphor6.DataJSON != nil {
		if err := json.Unmarshal([]byte(*porphor6.DataJSON), &dataJSON); err != nil {
			return nil, errors.New("invalid data_json format")
		}
	}

	return &GradePorphor6Response{
		Porphor6Data: &constant.Porphor6DataResponse{
			ID:               porphor6.ID,
			LearningAreaName: porphor6.LearningAreaName,
			StudentID:        porphor6.StudentID,
			DataJSON:         dataJSON,
			CreatedAt:        porphor6.CreatedAt,
		}, EvaluationFormData: evaluation,
	}, nil
}
