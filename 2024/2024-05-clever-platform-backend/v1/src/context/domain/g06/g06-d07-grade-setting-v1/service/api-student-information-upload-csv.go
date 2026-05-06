package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"mime/multipart"
	"net/http"
	"strings"
)

type StudentInformationUploadCsvRequest struct {
	AcademicYear string `form:"academic_year" validate:"required"`
	SubjectId    string
	Csvfile      *multipart.FileHeader
}

type StudentInformationUploadCsvResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentInformationUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentInformationUploadCsvRequest{}, helper.ParseOptions{Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, errors.New("subjectId is empty"))
	}
	request.SubjectId = subjectId

	form, err := context.MultipartForm()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if len(form.File["csv_file"]) > 0 {
		request.Csvfile = form.File["csv_file"][0]
	} else {
		msg := "No csv_file provided"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	err = api.Service.StudentInformationCsvUpload(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentInformationUploadCsvResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

func (service *serviceStruct) StudentInformationCsvUpload(req *StudentInformationUploadCsvRequest) error {

	tx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	csvMap := map[int]string{
		2: "citizen no",
		5: "student ID",
		7: "title",
		8: "first name",
		9: "last name",
	}

	callback := func(record []string) error {

		schoolID, err := service.gradeSettingStorage.SchoolGetIDByCode(tx, record[0])
		if err != nil {
			return err
		}
		if schoolID == 0 {
			return fmt.Errorf("schoolID not found with school code %s", record[0])
		}

		for k, v := range csvMap {
			if record[k] == "" {
				return fmt.Errorf(`%s cant be empty`, v)
			}
		}

		in := &constant.EvaluationStudent{
			ID:                  0,
			FormID:              0,
			CitizenNo:           helper.HandleStringToPointer(strings.ReplaceAll(record[2], " ", "")),
			StudentID:           helper.HandleStringToPointer(record[5]),
			Gender:              helper.HandleStringToPointer(record[6]),
			Title:               helper.HandleStringToPointer(record[7]),
			ThaiFirstName:       helper.HandleStringToPointer(record[8]),
			ThaiLastName:        helper.HandleStringToPointer(record[9]),
			EngFirstName:        nil,
			EngLastName:         nil,
			BirthDate:           helper.HandleStringToPointer(record[10]),
			Ethnicity:           helper.HandleStringToPointer(record[11]),
			Nationality:         helper.HandleStringToPointer(record[12]),
			Religion:            helper.HandleStringToPointer(record[13]),
			ParentMaritalStatus: helper.HandleStringToPointer(record[14]),
			FatherTitle:         helper.HandleStringToPointer(record[15]),
			FatherFirstName:     helper.HandleStringToPointer(record[16]),
			FatherLastName:      helper.HandleStringToPointer(record[17]),
			MotherTitle:         helper.HandleStringToPointer(record[18]),
			MotherFirstName:     helper.HandleStringToPointer(record[19]),
			MotherLastName:      helper.HandleStringToPointer(record[20]),
			GuardianRelation:    helper.HandleStringToPointer(record[21]),
			GuardianTitle:       helper.HandleStringToPointer(record[22]),
			GuardianFirstName:   helper.HandleStringToPointer(record[23]),
			GuardianLastName:    helper.HandleStringToPointer(record[24]),
			AddressNo:           helper.HandleStringToPointer(record[25]),
			AddressMoo:          helper.HandleStringToPointer(record[26]),
			AddressSubDistrict:  helper.HandleStringToPointer(record[27]),
			AddressDistrict:     helper.HandleStringToPointer(record[28]),
			AddressProvince:     helper.HandleStringToPointer(record[29]),
			AddressPostalCode:   helper.HandleStringToPointer(record[30]),
		}

		err = service.gradeSettingStorage.GradeStudentInformationUpsert(tx, schoolID, req.AcademicYear, record[3], record[4], in)
		if err != nil {
			return err
		}

		fmt.Println(in)

		return nil
	}
	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.StudentInformationCSVHeader)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
