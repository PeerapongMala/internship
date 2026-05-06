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
type EvaluationSheetUpdateRequest struct {
	*constant.EvaluationSheetEntity
	SubjectId string
}

// ==================== Response ==========================
type EvaluationSheetUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationSheetUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	id, err := context.ParamsInt("EvaluationSheetId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if id == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.ID = &id
	request.SubjectId = subjectId
	err = api.Service.EvaluationSheetUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationSheetUpdate(in *EvaluationSheetUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	in.UpdatedAt = &now
	in.UpdatedBy = &in.SubjectId
	err = service.gradeFormStorage.EvaluationSheetUpdate(sqlTx, in.EvaluationSheetEntity)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
