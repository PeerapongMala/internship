package service

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeEvaluationFormUpdateRequest struct {
	*constant.GradeEvaluationFormEntity
	SubjectId string
}

// ==================== Response ==========================
type GradeEvaluationFormUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationFormUpdateRequest{})
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

	request.Id = &id
	request.SubjectId = subjectId
	err = api.Service.GradeEvaluationFormUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationFormUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeEvaluationFormUpdate(in *GradeEvaluationFormUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	in.UpdatedAt = &now
	in.UpdatedBy = &in.SubjectId
	err = service.gradeFormStorage.GradeEvaluationFormUpdate(sqlTx, in.GradeEvaluationFormEntity)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func (service *serviceStruct) gradeEvaluationFormUpdate(tx *sqlx.Tx, now time.Time, subjectId string, in *constant.GradeEvaluationFormEntity) error {
	in.UpdatedAt = &now
	in.UpdatedBy = &subjectId

	if in.Id == nil || *in.Id == 0 {
		return fmt.Errorf("gradeEvaluationFormUpdate: id is nil")
	}
	id := *in.Id
	form, err := service.gradeFormStorage.GradeEvaluationFormGetById(*in.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if form == nil {
		log.Printf("id %d not found", id)
		return errors.Errorf("id %d not found", id)
	}
	if form.SchoolId != nil && in.SchoolId != nil && *form.SchoolId != *in.SchoolId {
		log.Printf("id %d is not the same school id", id)
		return errors.Errorf("id %d is not the same school id", id)
	}

	err = service.gradeFormStorage.GradeEvaluationFormUpdate(tx, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
