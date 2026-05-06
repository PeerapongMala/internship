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
type GradeTemplateUpdateRequest struct {
	Template        constant.GradeTemplateEntity               `json:"template"`
	Subjects        []constant.SubjectEntity                   `json:"subjects"`
	GeneralTemplate []constant.TemplateGeneralEvaluationEntity `json:"general_templates"`
	SubjectId       string                                     `json:"-"`
}

// ==================== Response ==========================
type GradeTemplateUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeTemplateUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	templateId, err := context.ParamsInt("gradeTemplateId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.Template.Id = &templateId
	request.SubjectId = subjectId
	err = api.Service.GradeTemplateUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeTemplateUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeTemplateUpdate(in *GradeTemplateUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	now := time.Now().UTC()
	in.Template.UpdatedAt = &now
	in.Template.UpdatedBy = &in.SubjectId

	err = service.gradeTemplateStorage.GradeTemplateUpdate(sqlTx, &in.Template)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
