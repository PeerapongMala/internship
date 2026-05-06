package service

import (
	"encoding/csv"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"
)

// ==================== Request ==========================

type ObserverCaseUploadCsvRequest struct {
	SchoolId int                   `params:"schoolId" validate:"required"`
	CsvFile  *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type ObserverCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverCaseUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverCaseUploadCsvRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.CsvFile = csvFile

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ObserverCaseUploadCsv(&ObserverCaseUploadCsvInput{
		SubjectId:                    subjectId,
		SchoolId:                     request.SchoolId,
		ObserverCaseUploadCsvRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type ObserverCaseUploadCsvInput struct {
	SubjectId string
	SchoolId  int
	*ObserverCaseUploadCsvRequest
}

func (service *serviceStruct) ObserverCaseUploadCsv(in *ObserverCaseUploadCsvInput) error {
	file, err := in.CsvFile.Open()
	if err != nil {
		return err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, err = reader.Read()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	tx, err := service.adminSchoolStorage.BeginTx()
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
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if len(row) != len(constant.ObserverCsvHeader) {
			msg := "Incorrect number of columns"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		userEntity := constant.UserEntity{}

		// id
		userEntity.Id = row[1]

		// email
		userEntity.Email = helper.HandleStringToPointer(row[2])

		// title
		if row[3] == "" {
			msg := fmt.Sprintf("Invalid title at column %d of row %d", 4, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		userEntity.Title = row[3]

		// first name
		if row[4] == "" {
			msg := fmt.Sprintf("Invalid first name at column %d of row %d", 5, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		userEntity.FirstName = row[4]

		// last name
		if row[5] == "" {
			msg := fmt.Sprintf("Invalid last name at column %d of row %d", 6, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		userEntity.LastName = row[5]

		// Id number
		userEntity.IdNumber = helper.HandleStringToPointer(row[6])

		// status
		if row[7] == "" || !slices.Contains(constant.UserStatusList, constant.UserStatus(row[7])) {
			msg := fmt.Sprintf("Invalid status at column %d of row %d", 8, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		userEntity.Status = row[7]

		if userEntity.Id == "" {
			userEntity.Id = uuid.NewString()
			userEntity.CreatedAt = time.Now().UTC()
			userEntity.CreatedBy = &in.SubjectId

			savedUser, err := service.adminSchoolStorage.UserCreate(tx, &userEntity)
			if err != nil {
				return err
			}

			err = service.adminSchoolStorage.SchoolCaseAddObserver(tx, in.SchoolId, userEntity.Id)
			if err != nil {
				return err
			}

			_, err = service.adminSchoolStorage.UserCaseAddUserRole(tx, userEntity.Id, []int{int(constant.Observer)})
			if err != nil {
				return err
			}

			userEntity.Id = savedUser.Id
		} else {
			now := time.Now().UTC()
			userEntity.UpdatedAt = &now
			userEntity.UpdatedBy = &in.SubjectId

			_, err := service.adminSchoolStorage.UserUpdate(tx, &userEntity)
			if err != nil {
				return err
			}
		}

		// password
		if row[8] != "" {
			passwordHash, err := helper.HashAndSalt(row[8])
			if err != nil {
				return err
			}
			err = service.adminSchoolStorage.AuthEmailPasswordUpdate(tx, &constant.AuthEmailPasswordEntity{
				UserId:       userEntity.Id,
				PasswordHash: *passwordHash,
			})
			if err != nil {
				return err
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
