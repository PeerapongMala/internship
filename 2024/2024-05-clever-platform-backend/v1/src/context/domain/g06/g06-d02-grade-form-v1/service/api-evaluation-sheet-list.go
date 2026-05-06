package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type EvaluationSheetListRequest struct {
	constant.EvaluationSheetListFilter
}

// ==================== Response ==========================

type EvaluationSheetListResponse struct {
	StatusCode int                                  `json:"status_code"`
	Pagination *helper.Pagination                   `json:"_pagination"`
	Data       []constant.EvaluationSheetListEntity `json:"data"`
	Message    string                               `json:"message"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) EvaluationSheetList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	output, err := api.Service.EvaluationSheetList(&EvaluationSheetListInput{
		Pagination: pagination,
		Filter:     request.EvaluationSheetListFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.List,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type EvaluationSheetListInput struct {
	Filter     constant.EvaluationSheetListFilter
	Pagination *helper.Pagination
}

type EvaluationSheetListOutput struct {
	List []constant.EvaluationSheetListEntity
}

func (service *serviceStruct) EvaluationSheetList(in *EvaluationSheetListInput) (*EvaluationSheetListOutput, error) {
	list, err := service.gradeFormStorage.EvaluationSheetList(nil, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &EvaluationSheetListOutput{
		List: list,
	}, nil
}
