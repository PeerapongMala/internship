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

type ContractCaseDownloadCsvRequest struct {
	SchoolAffiliationId int        `params:"schoolAffiliationId"`
	StartDate           *time.Time `query:"start_date"`
	EndDate             *time.Time `query:"end_date"`
}

// ==================== Request ==========================

func (api *APiStruct) ContractCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ContractCaseDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	contractCaseDownloadCsvOutput, err := api.Service.ContractCaseDownloadCsv(&ContractCaseDownloadCsvInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=contracts.csv")
	return context.Status(http.StatusOK).Send(
		contractCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type ContractCaseDownloadCsvInput struct {
	*ContractCaseDownloadCsvRequest
}

type ContractCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) ContractCaseDownloadCsv(in *ContractCaseDownloadCsvInput) (*ContractCaseDownloadCsvOutput, error) {
	contracts, err := service.schoolAffiliationStorage.SchoolAffiliationCaseListContract(in.SchoolAffiliationId, &constant.ContractFilter{
		StartDate: in.StartDate,
		EndDate:   in.EndDate,
	}, nil)
	if err != nil {
		return nil, err
	}

	thLocation, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		return nil, err
	}
	csvData := [][]string{constant.ContractCsvHeader}
	for i, contract := range contracts {
		startDate := contract.StartDate.In(thLocation)
		endDate := contract.StartDate.In(thLocation)
		startDateString := helper.FormatThaiDate(&startDate)
		endDateString := helper.FormatThaiDate(&endDate)

		updatedAtString, updatedByString := "", ""
		if contract.UpdatedAt != nil {
			updatedAt := contract.UpdatedAt.In(thLocation)
			updatedAtString = helper.FormatThaiDate(&updatedAt)
		}
		if contract.UpdatedBy != nil {
			updatedByString = *contract.UpdatedBy
		}
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(contract.Id),
			contract.Name,
			strconv.Itoa(contract.SchoolCount),
			startDateString,
			endDateString,
			updatedAtString,
			updatedByString,
			contract.Status,
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &ContractCaseDownloadCsvOutput{FileContent: bytes}, nil
}
