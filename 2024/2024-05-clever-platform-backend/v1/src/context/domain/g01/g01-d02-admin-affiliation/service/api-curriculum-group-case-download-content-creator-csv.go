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

type CurriculumGroupCaseDownloadContentCreatorCsvRequest struct {
	CurriculumGroupId int        `params:"curriculum_group_id"`
	StartDate         *time.Time `query:"start_date"`
	EndDate           *time.Time `query:"end_date"`
}

// ==================== Request ==========================

func (api *APiStruct) CurriculumGroupCaseDownloadContentCreatorCsv(context *fiber.Ctx) error {
	filter, err := helper.ParseAndValidateRequest(context, &constant.UserFilter{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	curriculumGroupCaseDownloadContentCreatorCsvOutput, err := api.Service.CurriculumGroupCaseDownloadContentCreatorCsv(&CurriculumGroupCaseDownloadContentCreatorCsvInput{
		filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=content-creators.csv")
	return context.Status(http.StatusOK).Send(curriculumGroupCaseDownloadContentCreatorCsvOutput.FileContent)
}

// ==================== Service ==========================

type CurriculumGroupCaseDownloadContentCreatorCsvInput struct {
	*constant.UserFilter
}

type CurriculumGroupCaseDownloadContentCreatorCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) CurriculumGroupCaseDownloadContentCreatorCsv(in *CurriculumGroupCaseDownloadContentCreatorCsvInput) (*CurriculumGroupCaseDownloadContentCreatorCsvOutput, error) {
	contentCreators, err := service.schoolAffiliationStorage.ContentCreatorList(&constant.UserFilter{
		CurriculumGroupId: in.CurriculumGroupId,
		StartDate:         in.StartDate,
		EndDate:           in.EndDate,
	}, nil)
	if err != nil {
		return nil, err
	}

	csvData := [][]string{constant.ContentCreatorCsvHeader}
	for i, contentCreator := range contentCreators {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			contentCreator.Id,
			contentCreator.Title,
			contentCreator.FirstName,
			contentCreator.LastName,
			contentCreator.Email,
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &CurriculumGroupCaseDownloadContentCreatorCsvOutput{
		FileContent: bytes,
	}, nil
}
