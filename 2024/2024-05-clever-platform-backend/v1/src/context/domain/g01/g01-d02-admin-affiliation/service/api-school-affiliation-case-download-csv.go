package service

import (
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type SchoolAffiliationCaseDownloadCsvRequest struct {
	StartDate *time.Time `query:"start_date"`
	EndDate   *time.Time `query:"end_date"`
}

// ==================== Response ==========================

func (api *APiStruct) SchoolAffiliationCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	schoolAffiliationCaseDownloadCsvOutput, err := api.Service.SchoolAffiliationCaseDownloadCsv(&SchoolAffiliationCaseDownloadCsvInput{
		SchoolAffiliationCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")

	context.Set("Content-Disposition", "attachment; filename=school-affiliations.csv")
	return context.Status(http.StatusOK).Send(schoolAffiliationCaseDownloadCsvOutput.fileContent)
}

// ==================== Service ==========================

type SchoolAffiliationCaseDownloadCsvInput struct {
	*SchoolAffiliationCaseDownloadCsvRequest
}

type SchoolAffiliationCaseDownloadCsvOutput struct {
	fileContent []byte
}

func (service *serviceStruct) SchoolAffiliationCaseDownloadCsv(in *SchoolAffiliationCaseDownloadCsvInput) (*SchoolAffiliationCaseDownloadCsvOutput, error) {
	schoolAffiliationList, err := service.schoolAffiliationStorage.SchoolAffiliationCaseListByDate(in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}
	csvData := [][]string{constant.SchoolAffiliationCsvHeader}
	for i, schoolAffiliation := range schoolAffiliationList {
		shortName := ""
		if schoolAffiliation.ShortName != nil {
			shortName = *schoolAffiliation.ShortName
		}
		baseString := []string{strconv.Itoa(i + 1), strconv.Itoa(schoolAffiliation.Id), schoolAffiliation.SchoolAffiliationGroup, schoolAffiliation.Type, schoolAffiliation.Name, shortName, schoolAffiliation.Status}

		if schoolAffiliation.SchoolAffiliationGroup == string(constant.Doe) {
			schoolAffiliationDoe, err := service.schoolAffiliationStorage.SchoolAffiliationDoeGet(schoolAffiliation.Id)
			if err != nil {
				return nil, err
			}
			baseString = append(baseString, schoolAffiliationDoe.DistrictZone, schoolAffiliationDoe.District)
		}
		if schoolAffiliation.SchoolAffiliationGroup == string(constant.Obec) {
			schoolAffiliationObec, err := service.schoolAffiliationStorage.SchoolAffiliationObecGet(schoolAffiliation.Id)
			if err != nil {
				return nil, err
			}
			baseString = append(baseString, "", "", schoolAffiliationObec.InspectionArea, schoolAffiliationObec.AreaOffice)
		}
		if schoolAffiliation.SchoolAffiliationGroup == string(constant.Lao) {
			schoolAffiliationLao, err := service.schoolAffiliationStorage.SchoolAffiliationLaoGet(schoolAffiliation.Id)
			if err != nil {
				return nil, err
			}
			baseString = append(baseString, "", "", "", "", schoolAffiliationLao.LaoType, schoolAffiliationLao.District, schoolAffiliationLao.SubDistrict, schoolAffiliationLao.Province)
		}

		for len(baseString) < len(constant.SchoolAffiliationCsvHeader) {
			baseString = append(baseString, "")
		}

		csvData = append(csvData, baseString)
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &SchoolAffiliationCaseDownloadCsvOutput{
		fileContent: bytes,
	}, nil
}
