package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"strconv"
	"time"
)

// ==================== Request ==========================

type AnnouncerCaseDownloadCsvRequest struct {
	SchoolId  int    `params:"schoolId" validate:"required"`
	StartDate string `query:"start_date,omitempty"`
	EndDate   string `query:"end_date,omitempty"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) AnnouncerCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AnnouncerCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
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

	announcerCaseDownloadCsvOutput, err := api.Service.AnnouncerCaseDownloadCsv(&AnnouncerCaseDownloadCsvInput{
		SchoolId:  request.SchoolId,
		StartDate: startDate,
		EndDate:   endDate,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=announcers.csv")
	return context.Status(http.StatusOK).Send(announcerCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type AnnouncerCaseDownloadCsvInput struct {
	SchoolId  int
	StartDate *time.Time
	EndDate   *time.Time
}

type AnnouncerCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) AnnouncerCaseDownloadCsv(in *AnnouncerCaseDownloadCsvInput) (*AnnouncerCaseDownloadCsvOutput, error) {
	announcers, err := service.adminSchoolStorage.AnnouncerList(&constant.AnnouncerFilter{
		SchoolId:  in.SchoolId,
		StartDate: in.StartDate,
		EndDate:   in.EndDate,
	}, nil)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.AnnouncerCsvHeader}
	for i, announcer := range announcers {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			announcer.Id,
			helper.HandleStringPointerField(announcer.Email),
			announcer.Title,
			announcer.FirstName,
			announcer.LastName,
			helper.HandleStringPointerField(announcer.IdNumber),
			announcer.Status,
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &AnnouncerCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
