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

type ObserverCaseDownloadCsvRequest struct {
	SchoolId  int    `params:"schoolId" validate:"required"`
	StartDate string `query:"start_date,omitempty"`
	EndDate   string `query:"end_date",omitempty`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverCaseDownloadCsvRequest{}, helper.ParseOptions{
		Params: true, Query: true,
	})
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

	observerCaseDownloadCsvOutput, err := api.Service.ObserverCaseDownloadCsv(
		&ObserverCaseDownloadCsvInput{
			SchoolId:  request.SchoolId,
			StartDate: startDate,
			EndDate:   endDate,
		})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=observers.csv")
	return context.Status(http.StatusOK).Send(observerCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type ObserverCaseDownloadCsvInput struct {
	SchoolId  int
	StartDate *time.Time
	EndDate   *time.Time
}

type ObserverCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) ObserverCaseDownloadCsv(in *ObserverCaseDownloadCsvInput) (*ObserverCaseDownloadCsvOutput, error) {
	observers, err := service.adminSchoolStorage.ObserverList(nil, &constant.ObserverFilter{
		SchoolId:  in.SchoolId,
		StartDate: in.StartDate,
		EndDate:   in.EndDate,
	})
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.ObserverCsvHeader}
	for i, observer := range observers {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			observer.Id,
			helper.HandleStringPointerField(observer.Email),
			observer.Title,
			observer.FirstName,
			observer.LastName,
			helper.HandleStringPointerField(observer.IdNumber),
			observer.Status,
			"",
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &ObserverCaseDownloadCsvOutput{
		FileContent: bytes,
	}, nil
}
