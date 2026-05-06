package service

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type StudentCaseDownloadCsvRequest struct {
	SchoolId  int    `params:"schoolId" validate:"required"`
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
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

	studentCaseDownloadCsvOutput, err := api.Service.StudentCaseDownloadCsv(&StudentCaseDownloadCsvInput{
		SchoolId:  request.SchoolId,
		StartDate: startDate,
		EndDate:   endDate,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=students.csv")
	return context.Status(http.StatusOK).Send(studentCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type StudentCaseDownloadCsvInput struct {
	SchoolId  int
	StartDate *time.Time
	EndDate   *time.Time
}

type StudentCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) StudentCaseDownloadCsv(in *StudentCaseDownloadCsvInput) (*StudentCaseDownloadCsvOutput, error) {
	students, err := service.adminSchoolStorage.StudentCaseListByDate(in.SchoolId, in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	csvData := [][]string{constant.StudentCsvHeader}
	for i, student := range students {
		birthDate := ""
		if student.BirthDate != nil {
			birthDate = student.BirthDate.In(location).Format("2/1/2006")
		}
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			student.Id,
			helper.HandleStringPointerField(student.Email),
			student.Title,
			student.FirstName,
			student.LastName,
			helper.HandleStringPointerField(student.IdNumber),
			student.Status,
			student.StudentId,
			student.Year,
			birthDate,
			helper.HandleStringPointerField(student.Nationality),
			helper.HandleStringPointerField(student.Ethnicity),
			helper.HandleStringPointerField(student.Religion),
			helper.HandleStringPointerField(student.FatherTitle),
			helper.HandleStringPointerField(student.FatherFirstName),
			helper.HandleStringPointerField(student.FatherLastName),
			helper.HandleStringPointerField(student.MotherTitle),
			helper.HandleStringPointerField(student.MotherFirstName),
			helper.HandleStringPointerField(student.MotherLastName),
			helper.HandleStringPointerField(student.ParentMaritalStatus),
			helper.HandleStringPointerField(student.ParentRelationship),
			helper.HandleStringPointerField(student.ParentTitle),
			helper.HandleStringPointerField(student.ParentFirstName),
			helper.HandleStringPointerField(student.ParentLastName),
			helper.HandleStringPointerField(student.HouseNumber),
			helper.HandleStringPointerField(student.Moo),
			helper.HandleStringPointerField(student.District),
			helper.HandleStringPointerField(student.SubDistrict),
			helper.HandleStringPointerField(student.Province),
			helper.HandleStringPointerField(student.PostCode),
			"",
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &StudentCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
