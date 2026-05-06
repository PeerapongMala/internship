package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeGeneralTemplateUpdateRequest struct {
	*constant.GradeGeneralTemplateEntity
	SubjectId string
}

// ==================== Response ==========================
type GradeGeneralTemplateUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeGeneralTemplateUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeGeneralTemplateUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.validateUpsertGradeGeneralTemplateEntity(request.GradeGeneralTemplateEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	id, err := context.ParamsInt("id")
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
	err = api.Service.GradeGeneralTemplateUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeGeneralTemplateUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeGeneralTemplateUpdate(in *GradeGeneralTemplateUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	in.UpdatedAt = &now
	in.UpdatedBy = &in.SubjectId
	err = service.gradeTemplateStorage.GradeGeneralTemplateUpdate(sqlTx, in.GradeGeneralTemplateEntity)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
