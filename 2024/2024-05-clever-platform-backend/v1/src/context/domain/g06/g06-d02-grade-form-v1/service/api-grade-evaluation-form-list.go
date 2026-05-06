package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type GradeEvaluationFormListRequest struct {
	constant.GradeEvaluationFormListFilter
}

// ==================== Response ==========================

type GradeEvaluationFormListResponse struct {
	Pagination *helper.Pagination             `json:"_pagination"`
	StatusCode int                            `json:"status_code"`
	Data       []constant.GradeFormListEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationFormListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeEvaluationFormList(&GradeFormListInput{
		Request:    request,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationFormListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Data:       resp.GradeEvaluationForm,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
type GradeFormListInput struct {
	Request    *GradeEvaluationFormListRequest
	Pagination *helper.Pagination
}

type GradeFormListOutput struct {
	GradeEvaluationForm []constant.GradeFormListEntity
}

func (service *serviceStruct) GradeEvaluationFormList(in *GradeFormListInput) (*GradeFormListOutput, error) {
	gradeEvaluationFormList, err := service.gradeFormStorage.GradeEvaluationFormList(in.Request.GradeEvaluationFormListFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &GradeFormListOutput{
		GradeEvaluationForm: gradeEvaluationFormList,
	}, nil
}
