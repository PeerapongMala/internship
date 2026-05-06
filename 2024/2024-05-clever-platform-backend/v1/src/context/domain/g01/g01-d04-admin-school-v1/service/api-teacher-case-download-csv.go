package service

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type TeacherCaseDownloadCsvRequest struct {
	SchoolId  int    `params:"schoolId" validate:"required"`
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var startDate, endDate *time.Time
	if request.StartDate != "" {
		startDateIn, err := time.Parse(time.RFC3339, request.StartDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
		startDate = &startDateIn
	}
	if request.EndDate != "" {
		endDateIn, err := time.Parse(time.RFC3339, request.EndDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
		endDate = &endDateIn
	}

	teacherCaseDownloadCsvOutput, err := api.Service.TeacherCaseDownloadCsv(&TeacherCaseDownloadCsvInput{
		SchoolId:  request.SchoolId,
		StartDate: startDate,
		EndDate:   endDate,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=teachers.csv")
	return context.Status(http.StatusOK).Send(teacherCaseDownloadCsvOutput.FileContent)

}

// ==================== Service ==========================

type TeacherCaseDownloadCsvInput struct {
	SchoolId  int
	StartDate *time.Time
	EndDate   *time.Time
}

type TeacherCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) TeacherCaseDownloadCsv(in *TeacherCaseDownloadCsvInput) (*TeacherCaseDownloadCsvOutput, error) {
	teachers, err := service.adminSchoolStorage.TeacherCaseListByDate(in.SchoolId, in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.TeacherCsvHeader}
	for i, teacher := range teachers {
		accesses := []string{}
		for _, access := range teacher.TeacherAccesses {
			accesses = append(accesses, strconv.Itoa(int(access)))
		}

		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			teacher.Id,
			helper.HandleStringPointerField(teacher.Email),
			teacher.Title,
			teacher.FirstName,
			teacher.LastName,
			helper.HandleStringPointerField(teacher.IdNumber),
			teacher.Status,
			strings.Join(accesses, ","),
			"",
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &TeacherCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
