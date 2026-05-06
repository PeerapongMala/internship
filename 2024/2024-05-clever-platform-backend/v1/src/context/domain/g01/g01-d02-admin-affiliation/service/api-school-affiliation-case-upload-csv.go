package service

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type SchoolAffiliationCaseUploadCsvRequest struct {
	CsvFile *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type SchoolAffiliationCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) SchoolAffiliationCaseUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SchoolAffiliationCaseUploadCsvRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

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

	err = api.Service.SchoolAffiliationCaseUploadCsv(&SchoolAffiliationCaseUploadCsvInput{
		SubjectId:                             subjectId,
		SchoolAffiliationCaseUploadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SchoolAffiliationCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type SchoolAffiliationCaseUploadCsvInput struct {
	SubjectId string
	*SchoolAffiliationCaseUploadCsvRequest
}

func (service *serviceStruct) SchoolAffiliationCaseUploadCsv(in *SchoolAffiliationCaseUploadCsvInput) error {
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
		if len(row) != len(constant.SchoolAffiliationCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		schoolAffiliationEntity := constant.SchoolAffiliationEntity{}

		// id
		if row[1] != "" {
			id, err := strconv.Atoi(row[1])
			if err != nil {
				msg := fmt.Sprintf(`Invalid id at column %d of row %d`, 2, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			schoolAffiliationEntity.Id = id
		}

		// school affiliation group
		if !slices.Contains(constant.SchoolAffiliationGroupList, constant.SchoolAffiliationGroup(row[2])) {
			msg := fmt.Sprintf("Invalid school affiliation group at column %d of row %d", 3, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		schoolAffiliationEntity.SchoolAffiliationGroup = row[2]

		// type
		if row[3] != "" && !slices.Contains(constant.SchoolAffiliationTypeList, row[3]) {
			msg := fmt.Sprintf("Invalid type at column %d of row %d", 4, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		schoolAffiliationEntity.Type = row[3]

		// name
		if row[4] == "" {
			msg := fmt.Sprintf(`Invalid name at column %d of row %d`, 5, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		schoolAffiliationEntity.Name = row[4]

		// short name
		if row[5] == "" {
			msg := fmt.Sprintf("Invalid short name at column %d of row %d", 6, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		schoolAffiliationEntity.ShortName = &row[5]

		// status
		if !slices.Contains(constant.SchoolAffiliationStatusList, row[6]) {
			msg := fmt.Sprintf("Invalid status at column %d of row %d", 7, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		schoolAffiliationEntity.Status = row[6]

		isNew := false
		if schoolAffiliationEntity.Id == 0 {
			schoolAffiliationEntity.CreatedAt = time.Now().UTC()
			schoolAffiliationEntity.CreatedBy = in.SubjectId
			schoolAffiliation, err := service.schoolAffiliationStorage.SchoolAffiliationCreate(tx, &schoolAffiliationEntity)
			if err != nil {
				return err
			}
			schoolAffiliationEntity = *schoolAffiliation
			isNew = true
		} else {
			now := time.Now().UTC()
			schoolAffiliationEntity.UpdatedAt = &now
			schoolAffiliationEntity.UpdatedBy = &in.SubjectId
			_, err = service.schoolAffiliationStorage.SchoolAffiliationUpdate(tx, &schoolAffiliationEntity)
			if err != nil {
				return err
			}
		}
		if schoolAffiliationEntity.SchoolAffiliationGroup == string(constant.Doe) {
			schoolAffiliationDoeEntity := constant.SchoolAffiliationDoeEntity{
				SchoolAffiliationId: schoolAffiliationEntity.Id,
			}

			if row[7] == "" {
				msg := fmt.Sprintf("Invalid district zone at column %d of row %d", 8, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			schoolAffiliationDoeEntity.DistrictZone = row[7]

			if row[8] == "" {
				msg := fmt.Sprintf("Invalid district at column %d of row %d", 9, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			schoolAffiliationDoeEntity.District = row[8]

			if isNew {
				_, err = service.schoolAffiliationStorage.SchoolAffiliationDoeCreate(tx, &schoolAffiliationDoeEntity)
				if err != nil {
					return err
				}
			} else {
				_, err = service.schoolAffiliationStorage.SchoolAffiliationDoeUpdate(tx, &schoolAffiliationDoeEntity)
				if err != nil {
					return err
				}
			}
		}
		if schoolAffiliationEntity.SchoolAffiliationGroup == string(constant.Obec) {
			schoolAffiliationObecEntity := constant.SchoolAffiliationObecEntity{
				SchoolAffiliationId: schoolAffiliationEntity.Id,
			}
			if row[9] == "" {
				msg := fmt.Sprintf("Invalid inspection area at column %d of row %d", 10, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			schoolAffiliationObecEntity.InspectionArea = row[9]

			if row[10] == "" {
				msg := fmt.Sprintf("Invalid area office at column %d of row %d", 11, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			schoolAffiliationObecEntity.AreaOffice = row[10]

			if isNew {
				_, err = service.schoolAffiliationStorage.SchoolAffiliationObecCreate(tx, &schoolAffiliationObecEntity)
				if err != nil {
					return err
				}
			} else {
				_, err = service.schoolAffiliationStorage.SchoolAffiliationObecUpdate(tx, &schoolAffiliationObecEntity)
				if err != nil {
					return err
				}
			}
		}
		if schoolAffiliationEntity.SchoolAffiliationGroup == string(constant.Lao) {
			schoolAffiliationLaoEntity := constant.SchoolAffiliationLaoEntity{
				SchoolAffiliationId: schoolAffiliationEntity.Id,
			}

			if !slices.Contains(constant.LaoTypeList, row[11]) {
				msg := fmt.Sprintf("Invalid lao type at column %d of row %d", 12, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			schoolAffiliationLaoEntity.LaoType = row[11]

			if schoolAffiliationLaoEntity.LaoType == constant.LaoTypePao {
				if row[14] == "" {
					msg := fmt.Sprintf("Invalid province at column %d of row %d", 15, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.Province = row[14]
			}
			if schoolAffiliationLaoEntity.LaoType == constant.LaoTypeSao {
				if row[12] == "" {
					msg := fmt.Sprintf("Invalid district at column %d of row %d", 13, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.District = row[12]

				if row[13] == "" {
					msg := fmt.Sprintf("Invalid sub-district at column %d of row %d", 14, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.SubDistrict = row[13]

				if row[14] == "" {
					msg := fmt.Sprintf("Invalid province at column %d of row %d", 15, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.Province = row[14]
			}
			if schoolAffiliationLaoEntity.LaoType == constant.LaoTypeCityMunicipality {
				if row[14] == "" {
					msg := fmt.Sprintf("Invalid province at column %d of row %d", 15, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.Province = row[14]
			}
			if schoolAffiliationLaoEntity.LaoType == constant.LaoTypeSubDistrictMunicipality {
				if row[12] == "" {
					msg := fmt.Sprintf("Invalid district at column %d of row %d", 13, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.District = row[12]

				if row[13] == "" {
					msg := fmt.Sprintf("Invalid sub-district at column %d of row %d", 14, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.SubDistrict = row[13]

				if row[14] == "" {
					msg := fmt.Sprintf("Invalid province at column %d of row %d", 15, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.Province = row[14]
			}
			if schoolAffiliationLaoEntity.LaoType == constant.LaoTypeDistrictMunicipality {
				if row[12] == "" {
					msg := fmt.Sprintf("Invalid district at column %d of row %d", 13, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.District = row[12]

				if row[14] == "" {
					msg := fmt.Sprintf("Invalid province at column %d of row %d", 15, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				schoolAffiliationLaoEntity.Province = row[14]
			}

			if isNew {
				_, err = service.schoolAffiliationStorage.SchoolAffiliationLaoCreate(tx, &schoolAffiliationLaoEntity)
				if err != nil {
					return err
				}
			} else {
				_, err = service.schoolAffiliationStorage.SchoolAffiliationLaoUpdate(tx, &schoolAffiliationLaoEntity)
				if err != nil {
					return err
				}
			}
		}

		lineNumber++
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
