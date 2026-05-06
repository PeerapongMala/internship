package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strings"
	"time"
)

// ==================== Request ==========================

type ClassroomDownloadCSVRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
	constant.ClassroomListFilter
}

// ==================== Endpoint ==========================

// @Id G01D05A05Get
// @Tags Admin Classroom
// @Summary Download classrooms CSV
// @Description ดาวน์โหลดข้อมูลห้องเรียนในรูป CSV
// @Security BearerAuth
// @Produce text/csv
// @Param schoolId path int true "schoolId"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param sort_by query int false "sort by field"
// @Param sort_order query int false "ASC or DESC"
// @Success 200 {string} string "CSV file"
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/classrooms/download/csv [get]
func (api *APiStruct) ClassroomDownloadCSV(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &ClassroomDownloadCSVRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
	}
	if len(request.StartUpdatedAtStr) > 0 {
		request.StartUpdatedAt, err = time.Parse("2006-01-02", request.StartUpdatedAtStr)
		if err != nil {
			return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
		}
	}
	if len(request.EndUpdatedAtStr) > 0 {
		request.EndUpdatedAt, err = time.Parse("2006-01-02", request.EndUpdatedAtStr)
		if err != nil {
			return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
		}
		request.EndUpdatedAt = request.EndUpdatedAt.AddDate(0, 0, 1)
	}

	classrooms, err := api.Service.ClassroomDownloadCSV(&ClassroomDownloadCSVInput{
		SchoolId:   request.SchoolId,
		Filter:     request.ClassroomListFilter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	rows := []string{strings.Join(constant.ClassroomCSVHeader, ",")}
	for i, c := range classrooms.Classrooms {
		row := fmt.Sprintf("%d,%d,%d,%s,%s,%s", i+1, c.Id, c.AcademicYear, c.Year, c.Name, c.Status)
		rows = append(rows, row)
	}
	csvContent := strings.Join(rows, "\n")

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", fmt.Sprintf("attachment; filename=classrooms_%d.csv", request.SchoolId))
	return context.Status(http.StatusOK).SendString(csvContent)
}

// ==================== Service ==========================

type ClassroomDownloadCSVInput struct {
	SchoolId   int
	Filter     constant.ClassroomListFilter
	Pagination *helper.Pagination
}

type ClassroomDownloadCSVOutput struct {
	Classrooms []constant.ClassEntity
}

func (service *serviceStruct) ClassroomDownloadCSV(in *ClassroomDownloadCSVInput) (*ClassroomDownloadCSVOutput, error) {
	classrooms, err := service.storage.ClassList(in.SchoolId, in.Filter, nil)
	if err != nil {
		return nil, err
	}
	return &ClassroomDownloadCSVOutput{
		Classrooms: classrooms,
	}, nil
}
