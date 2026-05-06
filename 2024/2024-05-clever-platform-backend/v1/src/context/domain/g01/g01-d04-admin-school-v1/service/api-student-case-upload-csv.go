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

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type StudentCaseUploadCsvRequest struct {
	CsvFile *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type StudentCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseUploadCsv(context *fiber.Ctx) error {
	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request := StudentCaseUploadCsvRequest{}
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

	err = api.Service.StudentCaseUploadCsv(&StudentCaseUploadCsvInput{
		SubjectId:                   subjectId,
		SchoolId:                    schoolId,
		StudentCaseUploadCsvRequest: &request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type StudentCaseUploadCsvInput struct {
	SubjectId string
	SchoolId  int
	*StudentCaseUploadCsvRequest
}

func (service *serviceStruct) StudentCaseUploadCsv(in *StudentCaseUploadCsvInput) error {
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
			return err
		}
		if len(row) != len(constant.StudentCsvHeader) {
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

		studentEntity := constant.StudentEntity{}

		// student id
		if row[8] == "" {
			msg := fmt.Sprintf("Invalid student id at column %d of row %d", 9, lineNumber)
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		studentEntity.StudentId = row[8]

		// year
		//studentEntity.Year = row[9]

		// birthdate
		if row[9] != "" {
			birthDate, err := time.Parse("2/1/2006", row[9])
			if err != nil {
				msg := fmt.Sprintf("Invalid birth date at column %d of row %d", 10, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			studentEntity.BirthDate = &birthDate
		}

		// nationality
		studentEntity.Nationality = helper.HandleStringToPointer(row[10])

		// ethnicity
		studentEntity.Ethnicity = helper.HandleStringToPointer(row[11])

		// religion
		studentEntity.Religion = helper.HandleStringToPointer(row[12])

		// father title
		studentEntity.FatherTitle = helper.HandleStringToPointer(row[13])

		// father first name
		studentEntity.FatherFirstName = helper.HandleStringToPointer(row[14])

		// father last name
		studentEntity.FatherLastName = helper.HandleStringToPointer(row[15])

		// mother title
		studentEntity.MotherTitle = helper.HandleStringToPointer(row[16])

		// mother first name
		studentEntity.MotherFirstName = helper.HandleStringToPointer(row[17])

		// mother last name
		studentEntity.MotherLastName = helper.HandleStringToPointer(row[18])

		// parent marital status
		studentEntity.ParentMaritalStatus = helper.HandleStringToPointer(row[19])

		// parent relationship
		studentEntity.ParentRelationship = helper.HandleStringToPointer(row[20])

		// parent title
		studentEntity.ParentTitle = helper.HandleStringToPointer(row[21])

		// parent first name
		studentEntity.ParentFirstName = helper.HandleStringToPointer(row[22])

		// parent last name
		studentEntity.ParentLastName = helper.HandleStringToPointer(row[23])

		// house number
		studentEntity.HouseNumber = helper.HandleStringToPointer(row[24])

		// moo
		studentEntity.Moo = helper.HandleStringToPointer(row[25])

		// district
		studentEntity.District = helper.HandleStringToPointer(row[26])

		// sub district
		studentEntity.SubDistrict = helper.HandleStringToPointer(row[27])

		// province
		studentEntity.Province = helper.HandleStringToPointer(row[28])

		// postcode
		studentEntity.PostCode = helper.HandleStringToPointer(row[29])

		// class academic year
		academicYear := 0
		if row[31] != "" {
			academicYear, err = strconv.Atoi(row[31])
			if err != nil || academicYear < 1000 || academicYear > 9999 {
				msg := fmt.Sprintf("Invalid academic year at column %d of row %d", 32, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
		}

		classYear := ""
		if row[32] != "" {
			classList := []string{"ป.1", "ป.2", "ป.3", "ป.4", "ป.5", "ป.6"}
			if !slices.Contains(classList, row[32]) {
				msg := fmt.Sprintf("Invalid class year at column %d of row %d", 33, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			classYear = row[32]
		}

		className := row[33]

		user := constant.UserEntity{}
		if userEntity.Id == "" {
			userEntity.Id = uuid.NewString()
			userEntity.CreatedAt = time.Now().UTC()
			userEntity.CreatedBy = &in.SubjectId
			studentEntity.UserId = userEntity.Id
			studentEntity.SchoolId = in.SchoolId

			studentData, err := service.adminSchoolStorage.StudentCreate(tx, &constant.StudentDataEntity{
				UserEntity:    &userEntity,
				StudentEntity: &studentEntity,
			})
			if err != nil {
				return err
			}
			user = *studentData.UserEntity
		} else {
			now := time.Now().UTC()
			userEntity.UpdatedAt = &now
			userEntity.UpdatedBy = &in.SubjectId
			studentEntity.UserId = userEntity.Id
			studentEntity.SchoolId = in.SchoolId

			studentData, err := service.adminSchoolStorage.StudentUpdate(tx, &constant.StudentDataEntity{
				UserEntity:    &userEntity,
				StudentEntity: &studentEntity,
			})
			if err != nil {
				return err
			}
			user = *studentData.UserEntity
		}

		// pin
		if row[30] != "" {
			err = service.adminSchoolStorage.AuthPinUpdate(tx, &constant.AuthPinEntity{
				UserId: user.Id,
				Pin:    row[30],
			})
			if err != nil {
				msg := fmt.Sprintf("Invalid pin at column %d of row %d", 31, lineNumber)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
		}

		if classYear != "" && className != "" && academicYear != 0 {
			classId := 0
			classId, err := service.adminSchoolStorage.ClassCreate(tx, in.SubjectId, className, classYear, academicYear, in.SchoolId)
			if err != nil {
				return err
			}

			err = service.adminSchoolStorage.ClassCaseAddStudent(tx, classId, user.Id)
			if err != nil {
				return err
			}

			err = service.PrefillClass(&PrefillClassInput{
				Tx:       tx,
				SchoolId: in.SchoolId,
				ClassId:  classId,
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
