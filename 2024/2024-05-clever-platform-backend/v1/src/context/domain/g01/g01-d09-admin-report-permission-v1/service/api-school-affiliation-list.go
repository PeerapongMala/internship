package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SchoolAffiliationListResponse struct {
	StatusCode int                                `json:"status_code"`
	Pagination *helper.Pagination                 `json:"_pagination"`
	Data       []constant.SchoolAffiliationEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolAffiliationList(context *fiber.Ctx) error {
	filter, err := helper.ParseAndValidateRequest(context, &constant.SchoolAffiliationFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	schoolAffiliationListOutput, err := api.Service.SchoolAffiliationList(&SchoolAffiliationListInput{
		Filter:     filter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolAffiliationListOutput.SchoolAffiliations,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolAffiliationListInput struct {
	Filter     *constant.SchoolAffiliationFilter
	Pagination *helper.Pagination
}

type SchoolAffiliationListOutput struct {
	SchoolAffiliations []constant.SchoolAffiliationEntity
}

func (service *serviceStruct) SchoolAffiliationList(in *SchoolAffiliationListInput) (*SchoolAffiliationListOutput, error) {
	schoolAffiliations, err := service.adminReportPermissionStorage.SchoolAffiliationList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationListOutput{
		schoolAffiliations,
	}, nil
}
