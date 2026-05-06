package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ObserverAccessCaseListSchoolResponse struct {
	StatusCode int                                   `json:"status_code"`
	Pagination *helper.Pagination                    `json:"_pagination"`
	Data       []constant.ObserverAccessSchoolEntity `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessCaseListSchool(context *fiber.Ctx) error {
	filter, err := helper.ParseAndValidateRequest(context, &constant.ObserverAccessSchoolFilter{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

	observerAccessCaseListSchoolOutput, err := api.Service.ObserverAccessCaseListSchool(&ObserverAccessCaseListSchoolInput{
		Filter:     filter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverAccessCaseListSchoolResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       observerAccessCaseListSchoolOutput.Schools,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ObserverAccessCaseListSchoolInput struct {
	Filter     *constant.ObserverAccessSchoolFilter
	Pagination *helper.Pagination
}

type ObserverAccessCaseListSchoolOutput struct {
	Schools []constant.ObserverAccessSchoolEntity
}

func (service *serviceStruct) ObserverAccessCaseListSchool(in *ObserverAccessCaseListSchoolInput) (*ObserverAccessCaseListSchoolOutput, error) {
	schools, err := service.adminReportPermissionStorage.ObserverAccessCaseListSchool(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ObserverAccessCaseListSchoolOutput{
		schools,
	}, nil
}
