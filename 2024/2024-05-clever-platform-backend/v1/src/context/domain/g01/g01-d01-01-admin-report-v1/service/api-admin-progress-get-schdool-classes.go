package service

import (
	"net/http"
	"time"

	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AdminProgressGetSchoolClassesRequest struct {
	SchoolId     int       `params:"schoolId" validate:"required"`
	AcademicYear string    `query:"academic-year" validate:"required"`
	Year         string    `query:"year" validate:"required"`
	StartDate    time.Time `query:"start-date" validate:"required"`
	EndDate      time.Time `query:"end-date" validate:"required"`
}

// ==================== Response ==========================

type AdminProgressGetSchoolClassesResponse struct {
	StatusCode int                       `json:"status_code"`
	Pagination *helper.Pagination        `json:"_pagination"`
	Data       []constant.ProgressReport `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AdminProgressGetSchoolClasses(context *fiber.Ctx) (err error) {
	request, err := helper.ParseAndValidateRequest(context, &AdminProgressGetSchoolClassesRequest{}, helper.ParseOptions{Query: true, Params: true})
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
	pagination := helper.PaginationNew(context)

	results, err := api.Service.AdminProgressGetSchoolClasses(&AdminProgressGetSchoolClassesInput{
		Pagination:                           pagination,
		ReportAccess:                         reportAccess,
		SubjectId:                            subjectId,
		AdminProgressGetSchoolClassesRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(AdminProgressGetSchoolClassesResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       results,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AdminProgressGetSchoolClassesInput struct {
	Pagination   *helper.Pagination
	ReportAccess *observerConstant.ReportAccess
	SubjectId    string
	*AdminProgressGetSchoolClassesRequest
}

func (service *serviceStruct) AdminProgressGetSchoolClasses(in *AdminProgressGetSchoolClassesInput) (outs []constant.ProgressReport, err error) {
	outs, err = service.Storage.AdminProgressGetSchoolTeacherClasses(in.SchoolId, in.AcademicYear, in.Year, in.Pagination, &in.StartDate, &in.EndDate)
	if err != nil {
		return
	}
	return
}
