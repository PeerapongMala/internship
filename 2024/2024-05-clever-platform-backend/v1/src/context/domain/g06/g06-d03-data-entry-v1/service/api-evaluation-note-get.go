package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type EvaluationNoteGetRequest struct {
	EvaluationSheetId int `params:"evaluationSheetId" validate:"required"`
	SubjectId         string
}

// ==================== Response ==========================
type EvaluationNoteGetResponse struct {
	constant.StatusResponse
	Data []constant.EvaluationFormNote `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationNoteGet(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationNoteGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	result, err := api.Service.EvaluationNoteGet(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationNoteGetResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: result,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationNoteGet(in *EvaluationNoteGetRequest) ([]constant.EvaluationFormNote, error) {
	result, err := service.gradeDataEntryStorage.GetListEvaluationFormNoteBySheetId(in.EvaluationSheetId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for i, note := range result {
		if note.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*note.ImageUrl)
			if err != nil {
				return nil, err
			}
			result[i].ImageUrl = url
		}
	}

	return result, nil
}
