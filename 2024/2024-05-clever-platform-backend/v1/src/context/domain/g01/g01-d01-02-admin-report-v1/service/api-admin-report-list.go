package service

import (
	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type AdminReportListRequest struct {
	ParentScope string     `query:"parent_scope"`
	Scope       string     `query:"scope" validate:"required"`
	StartDate   *time.Time `query:"start_date" validate:"required"`
	EndDate     *time.Time `query:"end_date" validate:"required"`
}

// ==================== Response ==========================

type AdminReportListResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.AdminReport `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AdminReportList(context *fiber.Ctx) error {
	pagination := helper.PaginationDropdown(context)
	request, err := helper.ParseAndValidateRequest(context, &AdminReportListRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	reportAccess, ok := context.Locals("reportAccess").(*observerConstant.ReportAccess)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	adminReportListOutput, err := api.Service.AdminReportList(&AdminReportListInput{
		Pagination:             pagination,
		ReportAccess:           reportAccess,
		SubjectId:              &subjectId,
		AdminReportListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AdminReportListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       []constant.AdminReport{adminReportListOutput.AdminReport},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AdminReportListInput struct {
	Pagination   *helper.Pagination
	ReportAccess *observerConstant.ReportAccess
	SubjectId    *string
	*AdminReportListRequest
}

type AdminReportListOutput struct {
	AdminReport constant.AdminReport
}

func (service *serviceStruct) AdminReportList(in *AdminReportListInput) (*AdminReportListOutput, error) {
	err := service.ValidateReportScope(&ValidateReportScopeInput{
		Scope:       in.Scope,
		ParentScope: in.ParentScope,
	})
	if err != nil {
		return nil, err
	}

	averageProgress := 0.00
	adminReport := constant.AdminReport{
		AverageProgress: &averageProgress,
		StartDate:       in.StartDate,
		EndDate:         in.EndDate,
	}
	progressReports := []constant.ProgressReport{}

	switch in.Scope {
	case constant.InspectionArea:
		progressReports, err = service.adminReportStorage.InspectionAreaProgressList(in.Pagination, in.StartDate, in.EndDate, in.ReportAccess)
		if err != nil {
			return nil, err
		}
	case constant.AreaOffice:
		progressReports, err = service.adminReportStorage.AreaOfficeProgressList(in.Pagination, in.StartDate, in.EndDate, in.ReportAccess, in.ParentScope)
		if err != nil {
			return nil, err
		}
	case constant.DistrictZone:
		progressReports, err = service.adminReportStorage.DistrictZoneProgressList(in.Pagination, in.StartDate, in.EndDate, in.ReportAccess)
		if err != nil {
			return nil, err
		}
	case constant.District:
		progressReports, err = service.adminReportStorage.DistrictProgressList(in.Pagination, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
	case constant.Province:
		progressReports, err = service.adminReportStorage.ProvinceProgressList(in.Pagination, in.StartDate, in.EndDate, in.ReportAccess)
		if err != nil {
			return nil, err
		}
	case constant.LaoDistrict:
		progressReports, err = service.adminReportStorage.LaoDistrictProgressList(in.Pagination, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
	case constant.LaoSchool:
		progressReports, err = service.adminReportStorage.LaoSchoolProgressList(in.Pagination, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
	case constant.School:
		progressReports, err = service.adminReportStorage.SchoolProgressList(in.Pagination, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
	case constant.OpecSchool:
		progressReports, err = service.adminReportStorage.OpecEtcSchoolProgressList(in.Pagination, in.StartDate, in.EndDate, in.ReportAccess, "สช")
		if err != nil {
			return nil, err
		}
	case constant.DoeSchool:
		progressReports, err = service.adminReportStorage.DoeSchoolProgressList(in.Pagination, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
	case constant.EtcSchool:
		progressReports, err = service.adminReportStorage.OpecEtcSchoolProgressList(in.Pagination, in.StartDate, in.EndDate, in.ReportAccess, "อื่นๆ")
		if err != nil {
			return nil, err
		}
	case constant.Year:
		progressReports, err = service.adminReportStorage.YearProgressList(in.Pagination, in.StartDate, in.EndDate, in.ParentScope)
		if err != nil {
			return nil, err
		}
	}

	adminReport.ProgressReports = progressReports
	totalProgress := 0.00
	for i, progressReport := range progressReports {
		progress := helper.Round(progressReport.Progress)
		progressReports[i].Progress = progress
		totalProgress += progress
	}
	if len(progressReports) != 0 {
		averageProgress = helper.Round(totalProgress / float64(len(progressReports)))
		adminReport.AverageProgress = &averageProgress
	}

	return &AdminReportListOutput{
		AdminReport: adminReport,
	}, nil
}
