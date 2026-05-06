package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type IndicatorListRequest struct {
	SubjectId int `params:"subjectId" validate:"required"`
}

// ==================== Response ==========================

type IndicatorListResponse struct {
	Pagination *helper.Pagination         `json:"_pagination"`
	StatusCode int                        `json:"status_code"`
	Data       []constant.IndicatorEntity `json:"data"`
	Message    string                     `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) IndicatorList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &IndicatorListRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	indicatorListOutput, err := api.Service.IndicatorList(&IndicatorListInput{
		request,
	})

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(IndicatorListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Data:       indicatorListOutput.Indicators,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type IndicatorListInput struct {
	*IndicatorListRequest
}
type IndicatorListOutput struct {
	Indicators []constant.IndicatorEntity
}

func (service *serviceStruct) IndicatorList(in *IndicatorListInput) (*IndicatorListOutput, error) {
	indicators, err := service.gradeTemplateStorage.IndicatorListBySubject(in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &IndicatorListOutput{
		Indicators: indicators,
	}, nil
}
