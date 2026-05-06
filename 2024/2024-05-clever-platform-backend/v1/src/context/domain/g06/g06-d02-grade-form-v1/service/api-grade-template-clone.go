package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GradeTemplateCloneRequest struct {
	TemplateId int `json:"template_id"`
	FormId     int `json:"form_id"`
}

type GradeTemplateCloneResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeTemplateClone(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GradeTemplateCloneRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.GradeTemplateClone(&GradeTemplateCloneInput{
		GradeTemplateCloneRequest: request,
		SubjectId:                 subjectId,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeTemplateCloneResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
	})
}

// ==================== Service ==========================

type GradeTemplateCloneInput struct {
	*GradeTemplateCloneRequest
	SubjectId string
}

func (service *serviceStruct) GradeTemplateClone(in *GradeTemplateCloneInput) error {
	//if in.FormId != 0 {
	//	err := service.GradeEvaluationFormCloneTemplate(&GradeEvaluationFormCloneTemplateInput{
	//		GradeEvaluationFormCloneTemplateRequest: &GradeEvaluationFormCloneTemplateRequest{
	//			FormId: in.FormId,
	//		},
	//		SubjectId: in.SubjectId,
	//		IsPublic:  true,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//}

	if in.TemplateId != 0 {
		err := service.CloneGradeTemplate(&CloneGradeTemplateInput{
			TemplateId: in.TemplateId,
			SubjectId:  in.SubjectId,
			IsPublic:   true,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
