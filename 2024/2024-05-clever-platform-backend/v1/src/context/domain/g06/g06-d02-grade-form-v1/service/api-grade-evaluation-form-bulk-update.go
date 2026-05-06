package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeEvaluationFormBulkUpdateRequest struct {
	BulkEditList []*constant.GradeEvaluationFormEntity `json:"bulk_edit_list"`
	SubjectId    string
}

// ==================== Response ==========================
type GradeEvaluationFormBulkUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormBulkUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationFormBulkUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.GradeEvaluationFormBulkUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationFormBulkUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeEvaluationFormBulkUpdate(in *GradeEvaluationFormBulkUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()

	for i, v := range in.BulkEditList {
		v.UpdatedAt = &now
		v.UpdatedBy = &in.SubjectId
		err = service.gradeFormStorage.GradeEvaluationFormUpdate(sqlTx, v)
		if err != nil {
			log.Printf("update row %d got error %+v", i, errors.WithStack(err))
			return fmt.Errorf("update row %d got error %+v", i, errors.WithStack(err))
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
