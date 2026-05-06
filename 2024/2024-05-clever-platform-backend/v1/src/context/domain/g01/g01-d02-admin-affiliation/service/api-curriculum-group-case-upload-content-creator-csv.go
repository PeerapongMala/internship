package service

import (
	"encoding/csv"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
)

// ==================== Request ==========================

type CurriculumGroupCaseUploadContentCreatorCsvRequest struct {
	CurriculumGroupId int                   `params:"curriculumGroupId" validate:"required"`
	CsvFile           *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type CurriculumGroupCaseUploadContentCreatorCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupCaseUploadContentCreatorCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CurriculumGroupCaseUploadContentCreatorCsvRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.CsvFile = csvFile

	err = api.Service.CurriculumGroupCaseUploadContentCreatorCsv(&CurriculumGroupCaseUploadContentCreatorCsvInput{
		CurriculumGroupCaseUploadContentCreatorCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CurriculumGroupCaseUploadContentCreatorCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type CurriculumGroupCaseUploadContentCreatorCsvInput struct {
	*CurriculumGroupCaseUploadContentCreatorCsvRequest
}

func (service *serviceStruct) CurriculumGroupCaseUploadContentCreatorCsv(in *CurriculumGroupCaseUploadContentCreatorCsvInput) error {
	file, err := in.CsvFile.Open()
	if err != nil {
		return err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, err = reader.Read()
	if err != nil {
		return err
	}

	tx, err := service.schoolAffiliationStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	lineNumber := 2
	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}
		if len(row) != len(constant.ContentCreatorCsvHeader) {
			log.Println(len(row), len(constant.ContentCreatorCsvHeader))
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		if row[1] == "" {
			msg := fmt.Sprintf("Invalid id at column %d of row %d", 2, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		err = service.schoolAffiliationStorage.CurriculumGroupCaseAddContentCreator(tx, in.CurriculumGroupId, row[1])
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
