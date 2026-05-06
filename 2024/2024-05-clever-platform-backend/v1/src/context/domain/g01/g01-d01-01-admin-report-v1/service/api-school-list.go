package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type SchoolListRequest struct {
	Type  string `query:"type" validate:"required"`
	Scope string `query:"scope"`
}

// ==================== Response ==========================

type SchoolListResponse struct {
	StatusCode int                     `json:"status_code"`
	Pagination *helper.Pagination      `json:"_pagination"`
	Data       []constant.SchoolEntity `json:"data"`
	Message    string                  `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SchoolListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	schoolListOutput, err := api.Service.SchoolList(&SchoolListInput{
		Pagination:        pagination,
		SchoolListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolListOutput.Schools,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolListInput struct {
	Pagination *helper.Pagination
	*SchoolListRequest
}

type SchoolListOutput struct {
	Schools []constant.SchoolEntity
}

func (service *serviceStruct) SchoolList(in *SchoolListInput) (*SchoolListOutput, error) {
	schools, err := service.Storage.SchoolList(in.Pagination, in.Type, in.Scope)
	if err != nil {
		return nil, err
	}

	return &SchoolListOutput{
		Schools: schools,
	}, nil
}
