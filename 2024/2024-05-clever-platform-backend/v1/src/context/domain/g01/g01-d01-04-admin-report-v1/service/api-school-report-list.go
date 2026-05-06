package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"net/http"
)

// ==================== Request ==========================

type SchoolReportListRequest struct {
	constant.SchoolReportFilter
}

type SchoolReportListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"_pagination"`
	Data       []constant.SchoolReportEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SchoolReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &SchoolReportListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	schoolReportListOutput, err := api.Service.SchoolReportList(&SchoolReportListInput{
		ReportAccess:       reportAccess,
		SchoolIds:          reportAccess.SchoolIds,
		Pagination:         pagination,
		SchoolReportFilter: &request.SchoolReportFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SchoolReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       schoolReportListOutput.SchoolReports,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SchoolReportListInput struct {
	ReportAccess *constant2.ReportAccess
	SchoolIds    pq.Int64Array
	Pagination   *helper.Pagination
	*constant.SchoolReportFilter
}

type SchoolReportListOutput struct {
	SchoolReports []constant.SchoolReportEntity
}

func (service *serviceStruct) SchoolReportList(in *SchoolReportListInput) (*SchoolReportListOutput, error) {
	schoolReports, err := service.adminReportStorage.SchoolReportList(in.SchoolIds, in.Pagination, in.SchoolReportFilter, in.ReportAccess.CanAccessAll)
	if err != nil {
		return nil, err
	}

	return &SchoolReportListOutput{
		SchoolReports: schoolReports,
	}, nil
}
