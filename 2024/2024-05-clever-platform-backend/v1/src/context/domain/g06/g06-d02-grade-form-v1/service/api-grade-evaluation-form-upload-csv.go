package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type GradeEvaluationFormUploadCsvResponse struct {
	Pagination *helper.Pagination             `json:"_pagination"`
	StatusCode int                            `json:"status_code"`
	Data       []constant.GradeFormListEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormUploadCsv(context *fiber.Ctx) error {

	schoolId, err := context.ParamsInt("schoolId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	if schoolId == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, err)
	}

	form, err := context.MultipartForm()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var csvFile *multipart.FileHeader
	if len(form.File["csv_file"]) > 0 {
		csvFile = form.File["csv_file"][0]
	} else {
		msg := "No csv_file provided"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	err = api.Service.SchoolCsvUpload(GradeFormUploadCsvInput{
		SubjectId: subjectId,
		SchoolId:  schoolId,
		Csvfile:   csvFile,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
type GradeFormUploadCsvInput struct {
	SubjectId string
	SchoolId  int
	//Pagination *helper.Pagination
	Csvfile *multipart.FileHeader
}

type GradeFormUploadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) SchoolCsvUpload(req GradeFormUploadCsvInput) error {

	tx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	now := time.Now().UTC()

	callback := func(record []string) error {
		row0 := record[0]
		row1 := record[1]
		row2 := record[2]
		//row3 := record[3]
		row4 := record[4]
		row5 := record[5]
		row6 := record[6]
		row7 := record[7]
		row8 := record[8]
		row9 := record[9]

		var id int
		if row1 != "" {
			id, err = strconv.Atoi(row1)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row0)
			}
		}
		var templateId int
		if row2 == "" {
			log.Printf("CsvFile RowNo: %s is empty template id", row0)
		}
		templateId, err = strconv.Atoi(row2)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Errorf("CSVFile RowNo: %s is error by id is not integer", row2)
		}

		var isLocked bool
		if row8 == "true" {
			isLocked = true
		}

		in := &constant.GradeEvaluationFormEntity{
			SchoolId:     &req.SchoolId,
			TemplateId:   &templateId,
			AcademicYear: &row4,
			Year:         &row5,
			SchoolRoom:   &row6,
			SchoolTerm:   &row7,
			IsLock:       &isLocked,
			Status:       (*constant.EvaluationFormStatus)(&row9),
			//AdminLoginAs: nil,
		}

		if id != 0 {
			in.Id = &id
			err = service.gradeEvaluationFormUpdate(tx, now, req.SubjectId, in)
			if err != nil {
				log.Printf("%+v error:update", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
			}
		} else {
			_, err = service.gradeEvaluationFormCreate(tx, now, req.SubjectId, in)
			if err != nil {
				log.Printf("error : Create")
				log.Printf("%+v", errors.WithStack(err))
				return errors.Errorf("CSVFile RowNo: %s is %s", record[0], err.Error())
			}
		}

		return nil
	}
	file, err := req.Csvfile.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	err = helper.ReadCSVFileWithValidateHeaders(&file, callback, nil, constant.GradeEvaluationFormCSVHeader)
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
