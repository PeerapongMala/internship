package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strconv"
	"time"
)

// ==================== Request ==========================

type SeedYearCaseDownloadCsvRequest struct {
	StartDate time.Time `query:"start_date"`
	EndDate   time.Time `query:"end_date"`
}

// ==================== Response ==========================

func (api *APiStruct) SeedYearCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SeedYearCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	seedYearCaseDownloadCsvOutput, err := api.Service.SeedYearCaseDownloadCsv(&SeedYearCaseDownloadCsvInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=seed-year.csv")
	return context.Status(http.StatusOK).Send(seedYearCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type SeedYearCaseDownloadCsvInput struct {
	*SeedYearCaseDownloadCsvRequest
}

type SeedYearCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) SeedYearCaseDownloadCsv(in *SeedYearCaseDownloadCsvInput) (*SeedYearCaseDownloadCsvOutput, error) {
	seedYears, err := service.schoolAffiliationStorage.SeedYearList(&constant.SeedYearFilter{
		StartDate: in.StartDate,
		EndDate:   in.EndDate,
	}, nil)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.SeedYearCsvHeader}
	for i, seedYear := range seedYears {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(seedYear.Id),
			seedYear.Name,
			seedYear.ShortName,
		})
	}
	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &SeedYearCaseDownloadCsvOutput{FileContent: bytes}, nil
}
