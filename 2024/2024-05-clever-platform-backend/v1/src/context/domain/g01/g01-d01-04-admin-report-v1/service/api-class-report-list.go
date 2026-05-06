package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassReportListRequest struct {
	constant.ClassReportFilter
}

// ==================== Response ==========================

type ClassReportListResponse struct {
	StatusCode int                          `json:"status_code"`
	Pagination *helper.Pagination           `json:"_pagination"`
	Data       []constant.ClassReportEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &ClassReportListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*constant2.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classReportListOutput, err := api.Service.ClassReportList(&ClassReportListInput{
		ReportAccess:           reportAccess,
		Pagination:             pagination,
		ClassReportListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&ClassReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       classReportListOutput.ClassReports,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassReportListInput struct {
	ReportAccess *constant2.ReportAccess
	Pagination   *helper.Pagination
	*ClassReportListRequest
}

type ClassReportListOutput struct {
	ClassReports []constant.ClassReportEntity
}

func (service *serviceStruct) ClassReportList(in *ClassReportListInput) (*ClassReportListOutput, error) {
	classReports, err := service.adminReportStorage.ClassReportList(in.Pagination, &in.ClassReportFilter)
	if err != nil {
		return nil, err
	}
	for i, classReport := range classReports {
		classReports[i].AveragePassedLevels = helper.ToPtr(helper.Round(helper.Deref(classReport.AveragePassedLevels)))
		classReports[i].AverageTotalScore = helper.ToPtr(helper.Round(helper.Deref(classReport.AverageTotalScore)))
	}

	return &ClassReportListOutput{
		ClassReports: classReports,
	}, nil
}
