package service

import (
	"net/http"
	"sort"
	"time"

	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AdminProgressGetSchoolTeachersRequest struct {
	SchoolId  int       `params:"schoolId" validate:"required"`
	StartDate time.Time `query:"start-date" validate:"required"`
	EndDate   time.Time `query:"end-date" validate:"required"`
}

// ==================== Response ==========================

type AdminProgressGetSchoolTeachersResponse struct {
	StatusCode int                                `json:"status_code"`
	Pagination *helper.Pagination                 `json:"_pagination"`
	Data       []constant.AdminReportTeacherStats `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AdminProgressGetSchoolTeachers(context *fiber.Ctx) (err error) {
	request, err := helper.ParseAndValidateRequest(context, &AdminProgressGetSchoolTeachersRequest{}, helper.ParseOptions{Query: true, Params: true})
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

	results, err := api.Service.AdminProgressGetSchoolTeachers(&AdminProgressGetSchoolTeachersInput{
		Pagination:                            pagination,
		ReportAccess:                          reportAccess,
		SubjectId:                             subjectId,
		AdminProgressGetSchoolTeachersRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(AdminProgressGetSchoolTeachersResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       results,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AdminProgressGetSchoolTeachersInput struct {
	Pagination   *helper.Pagination
	ReportAccess *observerConstant.ReportAccess
	SubjectId    string
	*AdminProgressGetSchoolTeachersRequest
}

func (service *serviceStruct) AdminProgressGetSchoolTeachers(in *AdminProgressGetSchoolTeachersInput) (outs []constant.AdminReportTeacherStats, err error) {
	outs = []constant.AdminReportTeacherStats{}

	progressReports, err := service.Storage.AdminProgressGetSchoolTeacherStatistics(in.SchoolId, in.Pagination, &in.StartDate, &in.EndDate)

	for _, pr := range progressReports {
		name, classRoomCount, homeworkCount, queryErr := service.Storage.AdminProgressGetSchoolTeacherClassStatistics(pr.Scope)
		if err != nil {
			err = queryErr
			return
		}
		outs = append(
			outs,
			constant.AdminReportTeacherStats{
				TeacherId:      &pr.Scope,
				TeacherName:    name,
				ClassRoomCount: int64(classRoomCount),
				HomeworkCount:  int64(homeworkCount),
				Progress:       pr.Progress,
			},
		)
	}

	sort.Slice(outs, func(i, j int) bool {
		return outs[i].TeacherName < outs[j].TeacherName
	})
	return
}
