package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolListResponse struct {
	StatusCode int                     `json:"status_code"`
	Pagination *helper.Pagination      `json:"_pagination"`
	Data       []constant.SchoolEntity `json:"data"`
	Message    string                  `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolList(context *fiber.Ctx) error {
	filter, err := helper.ParseAndValidateRequest(context, &constant.SchoolFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	schoolListOutput, err := api.Service.SchoolList(&SchoolListInput{
		Filter:     filter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SchoolListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolListOutput.Schools,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolListInput struct {
	Filter     *constant.SchoolFilter
	Pagination *helper.Pagination
}

type SchoolListOutput struct {
	Schools []constant.SchoolEntity
}

func (service *serviceStruct) SchoolList(in *SchoolListInput) (*SchoolListOutput, error) {
	schools, err := service.adminReportPermissionStorage.SchoolList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolListOutput{
		Schools: schools,
	}, err
}
