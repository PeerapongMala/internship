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
	"strings"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type TeacherCaseUploadCsvRequest struct {
	CsvFile *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type TeacherCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCaseUploadCsv(context *fiber.Ctx) error {
	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request := TeacherCaseUploadCsvRequest{}
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

	err = api.Service.TeacherCaseUploadCsv(&TeacherCaseUploadCsvInput{
		SubjectId:                   subjectId,
		SchoolId:                    schoolId,
		TeacherCaseUploadCsvRequest: &request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type TeacherCaseUploadCsvInput struct {
	SubjectId string
	SchoolId  int
	*TeacherCaseUploadCsvRequest
}

func (service *serviceStruct) TeacherCaseUploadCsv(in *TeacherCaseUploadCsvInput) error {
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
			return helper.NewHttpError(http.StatusInternalServerError, nil)
		}
		if len(row) != len(constant.TeacherCsvHeader) {
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

		user := constant.UserEntity{}
		if userEntity.Id == "" {
			userEntity.Id = uuid.NewString()
			userEntity.CreatedAt = time.Now().UTC()
			userEntity.CreatedBy = &in.SubjectId

			savedUser, err := service.adminSchoolStorage.UserCreate(tx, &userEntity)
			if err != nil {
				return err
			}
			_, err = service.adminSchoolStorage.UserCaseAddUserRole(tx, savedUser.Id, []int{int(constant.Teacher)})
			if err != nil {
				return err
			}
			err = service.adminSchoolStorage.SchoolCaseAddTeacher(tx, in.SchoolId, savedUser.Id)
			if err != nil {
				return err
			}
			user = *savedUser
		} else {
			now := time.Now().UTC()
			userEntity.UpdatedAt = &now
			userEntity.UpdatedBy = &in.SubjectId
			savedUser, err := service.adminSchoolStorage.UserUpdate(tx, &userEntity)
			if err != nil {
				return err
			}
			user = *savedUser
		}

		// accesses
		accesses := []int{}
		if row[8] != "" {
			accessStrings := strings.Split(row[8], ",")
			for _, accessString := range accessStrings {
				access, err := strconv.Atoi(accessString)
				if err != nil {
					msg := fmt.Sprintf("Invalid accesses at column %d of row %d", 9, lineNumber)
					return helper.NewHttpError(http.StatusBadRequest, &msg)
				}
				accesses = append(accesses, access)
			}
		}

		err = service.adminSchoolStorage.TeacherCaseUpdateTeacherAccesses(tx, user.Id, accesses)
		if err != nil {
			return err
		}

		// password
		if row[9] != "" {
			passwordHash, err := helper.HashAndSalt(row[9])
			if err != nil {
				return err
			}
			err = service.adminSchoolStorage.AuthEmailPasswordUpdate(tx, &constant.AuthEmailPasswordEntity{
				UserId:       user.Id,
				PasswordHash: *passwordHash,
			})
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
