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

type CurriculumGroupCaseDownloadCsvRequest struct {
	StartDate time.Time `query:"start_date"`
	EndDate   time.Time `query:"end_date"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupCaseDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	curriculumGroupCaseDownloadCsvOutput, err := api.Service.CurriculumGroupCaseDownloadCsv(&CurriculumGroupCaseDownloadCsvInput{
		CurriculumGroupCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Attachment("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=curriculum-groups.csv")
	return context.Status(http.StatusOK).Send(curriculumGroupCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type CurriculumGroupCaseDownloadCsvInput struct {
	*CurriculumGroupCaseDownloadCsvRequest
}

type CurriculumGroupCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) CurriculumGroupCaseDownloadCsv(in *CurriculumGroupCaseDownloadCsvInput) (*CurriculumGroupCaseDownloadCsvOutput, error) {
	curriculumGroups, err := service.schoolAffiliationStorage.CurriculumGroupList(nil, &constant.CurriculumGroupFilter{StartDate: in.StartDate, EndDate: in.EndDate})
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.CurriculumGroupCsvHeader}
	for i, curriculumGroup := range curriculumGroups {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(curriculumGroup.Id),
			curriculumGroup.Name,
			curriculumGroup.ShortName,
			curriculumGroup.Status,
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupCaseDownloadCsvOutput{FileContent: bytes}, nil
}
