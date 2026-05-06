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
type EvaluationSheetHistoryCompareRequest struct {
	EvaluationSheetId int    `params:"evaluationSheetId" validate:"required"`
	VersionLeft       string `query:"versionLeft" validate:"required"`
	VersionRight      string `query:"versionRight" validate:"required"`
	SubjectId         string
}

// ==================== Response ==========================
type EvaluationSheetHistoryCompareResponse struct {
	constant.StatusResponse
	Data *EvaluationSheetHistoryCompareData `json:"data"`
}

type EvaluationSheetHistoryCompareData struct {
	VersionLeft  *constant.EvaluationDataEntry `json:"version_left"`
	VersionRight *constant.EvaluationDataEntry `json:"version_right"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationSheetHistoryCompare(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetHistoryCompareRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	result, err := api.Service.EvaluationSheetHistoryCompare(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetHistoryCompareResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: result,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationSheetHistoryCompare(in *EvaluationSheetHistoryCompareRequest) (*EvaluationSheetHistoryCompareData, error) {
	left, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(in.EvaluationSheetId, in.VersionLeft)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	right, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(in.EvaluationSheetId, in.VersionRight)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &EvaluationSheetHistoryCompareData{
		VersionLeft:  left,
		VersionRight: right,
	}, nil
}
