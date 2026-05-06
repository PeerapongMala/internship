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
	"strconv"
	"time"
)

// ==================== Request ==========================

type SeedYearCaseUploadCsvRequest struct {
	CsvFile *multipart.FileHeader
}

// ==================== Response ==========================

type SeedYearCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SeedYearCaseUploadCsv(context *fiber.Ctx) error {
	request := SeedYearCaseUploadCsvRequest{}
	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	request.CsvFile = csvFile

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SeedYearCaseUploadCsv(&SeedYearCaseUploadCsvInput{
		SubjectId:                    subjectId,
		SeedYearCaseUploadCsvRequest: &request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SeedYearCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type SeedYearCaseUploadCsvInput struct {
	SubjectId string
	*SeedYearCaseUploadCsvRequest
}

func (service *serviceStruct) SeedYearCaseUploadCsv(in *SeedYearCaseUploadCsvInput) error {
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
		if len(row) != len(constant.SeedYearCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		seedYearEntity := constant.SeedYearEntity{}

		// id
		if row[1] != "" {
			id, err := strconv.Atoi(row[1])
			if err != nil {
				msg := fmt.Sprintf("Invalid id at column %d of row %d", 2, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			seedYearEntity.Id = id
		}

		// Name
		if row[2] == "" {
			msg := fmt.Sprintf("Invalid name at column %d of row %d", 3, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		seedYearEntity.Name = row[2]

		// Short name
		if row[3] == "" {
			msg := fmt.Sprintf("Inavlid short name at column %d of row %d", 4, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		seedYearEntity.ShortName = row[3]

		if seedYearEntity.Id == 0 {
			seedYearEntity.CreatedAt = time.Now().UTC()
			seedYearEntity.CreatedBy = in.SubjectId
			seedYearEntity.Status = string(constant.Enabled)
			_, err := service.schoolAffiliationStorage.SeedYearCreate(tx, &seedYearEntity)
			if err != nil {
				return err
			}
		} else {
			now := time.Now().UTC()
			seedYearEntity.UpdatedAt = &now
			seedYearEntity.UpdatedBy = &in.SubjectId
			_, err := service.schoolAffiliationStorage.SeedYearUpdate(tx, &seedYearEntity)
			if err != nil {
				return err
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
