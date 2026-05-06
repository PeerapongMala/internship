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
	"slices"
	"strconv"
	"time"
)

// ==================== Request ==========================

type CurriculumGroupCaseUploadCsvRequest struct {
	CsvFile *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type CurriculumGroupCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) CurriculumGroupCaseUploadCsv(context *fiber.Ctx) error {
	request := CurriculumGroupCaseUploadCsvRequest{}
	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.CsvFile = csvFile

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.CurriculumGroupCaseUploadCsv(&CurriculumGroupCaseUploadCsvInput{
		SubjectId:                           subjectId,
		CurriculumGroupCaseUploadCsvRequest: &request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&CurriculumGroupCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type CurriculumGroupCaseUploadCsvInput struct {
	SubjectId string
	*CurriculumGroupCaseUploadCsvRequest
}

func (service *serviceStruct) CurriculumGroupCaseUploadCsv(in *CurriculumGroupCaseUploadCsvInput) error {
	file, err := in.CsvFile.Open()
	if err != nil {
		return err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, err = reader.Read()
	if err != nil {
		return helper.NewHttpError(http.StatusInternalServerError, nil)
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
			return helper.NewHttpError(http.StatusInternalServerError, nil)
		}
		if len(row) != len(constant.CurriculumGroupCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		curriculumGroupEntity := constant.CurriculumGroupEntity{}

		// id
		if row[1] != "" {
			id, err := strconv.Atoi(row[1])
			if err != nil {
				msg := fmt.Sprintf("Invalid id at column %d of row %d", 2, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			curriculumGroupEntity.Id = id
		}

		// name
		if row[2] == "" {
			msg := fmt.Sprintf("Invalid name at column %d of row %d", 3, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		curriculumGroupEntity.Name = row[2]

		// shortname
		if row[3] == "" {
			msg := fmt.Sprintf("Invalid short name at column %d of row %d", 4, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		curriculumGroupEntity.ShortName = row[3]

		// status
		if row[4] == "" || (row[4] != "" && !slices.Contains(constant.CurriculumGroupStatusList, row[4])) {
			msg := fmt.Sprintf("Invalid status at column %d of row %d", 5, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		curriculumGroupEntity.Status = row[4]

		if curriculumGroupEntity.Id == 0 {
			curriculumGroupEntity.CreatedAt = time.Now().UTC()
			curriculumGroupEntity.CreatedBy = in.SubjectId
			_, err := service.schoolAffiliationStorage.CurriculumGroupCreate(tx, &curriculumGroupEntity)
			if err != nil {
				return err
			}
		} else {
			now := time.Now().UTC()
			curriculumGroupEntity.UpdatedAt = &now
			curriculumGroupEntity.UpdatedBy = &in.SubjectId
			_, err := service.schoolAffiliationStorage.CurriculumGroupUpdate(tx, &curriculumGroupEntity)
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
