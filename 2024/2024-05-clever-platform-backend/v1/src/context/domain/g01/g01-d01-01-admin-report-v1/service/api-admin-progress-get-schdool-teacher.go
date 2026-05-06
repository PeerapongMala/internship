package service

import (
	"net/http"
	"time"

	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AdminProgressGetSchoolTeacherClassroomRequest struct {
	SchoolId  int       `params:"schoolId" validate:"required"`
	TeacherId string    `params:"teacherId" validate:"required"`
	StartDate time.Time `query:"start-date" validate:"required"`
	EndDate   time.Time `query:"end-date" validate:"required"`
}

// ==================== Response ==========================

type AdminProgressGetSchoolTeacherClassroomResponse struct {
	StatusCode int                       `json:"status_code"`
	Pagination *helper.Pagination        `json:"_pagination"`
	Data       []constant.ProgressReport `json:"data"`
	Message    string                    `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AdminProgressGetSchoolTeacherClassroom(context *fiber.Ctx) (err error) {
	request, err := helper.ParseAndValidateRequest(context, &AdminProgressGetSchoolTeacherClassroomRequest{}, helper.ParseOptions{Query: true, Params: true})
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

	results, err := api.Service.AdminProgressGetSchoolTeacherClassroom(&AdminProgressGetSchoolTeacherClassroomInput{
		Pagination:   pagination,
		ReportAccess: reportAccess,
		SubjectId:    subjectId,
		AdminProgressGetSchoolTeacherClassroomRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(AdminProgressGetSchoolTeacherClassroomResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       results,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AdminProgressGetSchoolTeacherClassroomInput struct {
	Pagination   *helper.Pagination
	ReportAccess *observerConstant.ReportAccess
	SubjectId    string
	*AdminProgressGetSchoolTeacherClassroomRequest
}

func (service *serviceStruct) AdminProgressGetSchoolTeacherClassroom(in *AdminProgressGetSchoolTeacherClassroomInput) (outs []constant.ProgressReport, err error) {
	outs, err = service.Storage.AdminProgressGetSchoolTeacherClassroomStatistics(in.SchoolId, in.TeacherId, in.Pagination, &in.StartDate, &in.EndDate)
	if err != nil {
		return
	}
	return
}
