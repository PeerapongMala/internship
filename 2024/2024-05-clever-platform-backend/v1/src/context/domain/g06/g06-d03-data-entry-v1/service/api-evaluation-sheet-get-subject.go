package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================
type EvaluationSheetGetSubjectRequest struct {
	EvaluationSheetId int `params:"evaluationSheetId" validate:"required"`
}

// ==================== Response ==========================
type EvaluationSheetGetSubjectResponse struct {
	constant.StatusResponse
	Data []constant.SheetSubject `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationSheetGetSubject(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetGetSubjectRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	result, err := api.Service.EvaluationSheetGetSubject(&EvaluationSheetGetSubjectInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetGetSubjectResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: []constant.SheetSubject{*result.SheetSubject},
	})
}

type EvaluationSheetGetSubjectInput struct {
	*EvaluationSheetGetSubjectRequest
}

type EvaluationSheetGetSubjectOutput struct {
	SheetSubject *constant.SheetSubject
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationSheetGetSubject(in *EvaluationSheetGetSubjectInput) (*EvaluationSheetGetSubjectOutput, error) {
	subject, err := service.gradeDataEntryStorage.EvaluationSheetGetSubject(in.EvaluationSheetId)
	if err != nil {
		return nil, err
	}

	return &EvaluationSheetGetSubjectOutput{
		SheetSubject: subject,
	}, nil
}
