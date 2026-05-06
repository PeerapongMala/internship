package service

import (
	"bytes"
	"encoding/csv"
	"log"
	"net/http"
	"slices"
	"strconv"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SavedTextCaseDownloadCsvRequest struct {
	StartDate *time.Time `query:"start_date"`
	EndDate   *time.Time `query:"end_date"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextCaseDownloadCsv(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &SavedTextCaseDownloadCsvRequest{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	savedTextCaseDownloadCsvOutput, err := api.Service.SavedTextCaseDownloadCsv(&SavedTextCaseDownloadCsvInput{
		Roles:                           roles,
		SubjectId:                       subjectId,
		CurriculumGroupId:               curriculumGroupId,
		SavedTextCaseDownloadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=saved-text.csv")
	return context.Status(http.StatusOK).Send(savedTextCaseDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type SavedTextCaseDownloadCsvInput struct {
	Roles             []int
	SubjectId         string
	CurriculumGroupId int
	*SavedTextCaseDownloadCsvRequest
}

type SavedTextCaseDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) SavedTextCaseDownloadCsv(in *SavedTextCaseDownloadCsvInput) (*SavedTextCaseDownloadCsvOutput, error) {
	contentCreators, err := service.academicTranslationStorage.CurriculumGroupCaseListContentCreator(in.CurriculumGroupId)
	if err != nil {
		return nil, err
	}

	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.SubjectId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	savedTextList, err := service.academicTranslationStorage.SavedTextCaseListByDate(in.CurriculumGroupId, in.StartDate, in.EndDate)
	if err != nil {
		return nil, err
	}

	var buffer bytes.Buffer
	writer := csv.NewWriter(&buffer)
	err = writer.Write(constant.SavedTextCsvHeader)
	if err != nil {
		return nil, err
	}
	for _, savedText := range savedTextList {
		text := ""
		textToAi := ""
		if savedText.Text != nil {
			text = *savedText.Text
		}
		if savedText.TextToAi != nil {
			textToAi = *savedText.TextToAi
		}

		err := writer.Write([]string{strconv.Itoa(savedText.Id), savedText.Language, text, textToAi, savedText.Status})
		if err != nil {
			return nil, err
		}
	}
	writer.Flush()
	err = writer.Error()
	if err != nil {
		return nil, err
	}

	fileContent := buffer.Bytes()
	return &SavedTextCaseDownloadCsvOutput{
		FileContent: fileContent,
	}, nil
}
