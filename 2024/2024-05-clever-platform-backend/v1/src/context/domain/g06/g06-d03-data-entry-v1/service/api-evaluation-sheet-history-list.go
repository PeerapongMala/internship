package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type EvaluationSheetHistoryListRequest struct {
	EvaluationSheetId int  `params:"evaluationSheetId" validate:"required"`
	NoDetails         bool `query:"no_details"`
}

// ==================== Response ==========================

type EvaluationSheetHistoryListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       interface{}        `json:"data"`
	Message    string             `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) EvaluationSheetHistoryList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetHistoryListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	output, err := api.Service.EvaluationSheetHistoryList(&EvaluationSheetHistoryListInput{
		EvaluationSheetId: request.EvaluationSheetId,
		Pagination:        pagination,
		NoDetails:         request.NoDetails,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetHistoryListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.List,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type EvaluationSheetHistoryListInput struct {
	EvaluationSheetId int
	Pagination        *helper.Pagination
	NoDetails         bool
}

type EvaluationSheetHistoryListOutput struct {
	List interface{}
}

func (service *serviceStruct) EvaluationSheetHistoryList(in *EvaluationSheetHistoryListInput) (*EvaluationSheetHistoryListOutput, error) {
	var list interface{}
	var err error
	if in.NoDetails {
		list, err = service.gradeDataEntryStorage.EvaluationDataEntryListNoDetails(in.EvaluationSheetId, in.Pagination)
	} else {
		list, err = service.gradeDataEntryStorage.EvaluationDataEntryListBySheetID(in.EvaluationSheetId, in.Pagination)
	}
	if err != nil {
		return nil, err
	}

	return &EvaluationSheetHistoryListOutput{
		List: list,
	}, nil
}
