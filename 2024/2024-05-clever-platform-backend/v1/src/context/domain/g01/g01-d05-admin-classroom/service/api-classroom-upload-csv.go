package service

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type ClassroomUploadCSVRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
}

// ==================== Response ==========================

type ClassroomUploadCSVResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A06Create
// @Tags Admin Classroom
// @Summary Upload CSV to create and update classrooms
// @Description อัพโหลดไฟล์ CSV ผ่าน multipart/form-data เพื่อสร้างและอัพเดทห้องเรียนหลายห้อง
// @Security BearerAuth
// @Accept multipart/form-data
// @Produce json
// @Param schoolId path int true "schoolId"
// @Param csv_file formData file true "CSV file"
// @Success 201 {object} ClassroomUploadCSVResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/classrooms/upload/csv [post]
func (api *APiStruct) ClassroomUploadCSV(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomUploadCSVRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
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

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	_, err = api.Service.ClassroomUploadCSV(&ClassroomUploadCSVInput{
		SubjectId: subjectId,
		SchoolId:  request.SchoolId,
		CsvFile:   csvFile,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(ClassroomUploadCSVResponse{
		StatusCode: http.StatusCreated,
		Message:    "Classrooms has been processed successfully",
	})
}

// ==================== Service ==========================

type ClassroomUploadCSVInput struct {
	SubjectId string
	SchoolId  int
	CsvFile   *multipart.FileHeader
}

type ClassroomUploadCSVOutput struct {
}

func (service *serviceStruct) ClassroomUploadCSV(in *ClassroomUploadCSVInput) (*ClassroomUploadCSVOutput, error) {

	rows, err := helper.NewCSVAllRow(in.CsvFile)
	if err != nil {
		return nil, err
	}

	if len(rows) == 0 {
		return nil, errors.New("no rows found")
	}

	header := rows[0]

	expectedHeader := constant.ClassroomCSVHeader
	if len(header) != len(expectedHeader) {
		msg := "CSV header format invalid"
		return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
	}
	for i, h := range header {
		if h != expectedHeader[i] {
			msg := "CSV header format invalid"
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}
	}

	now := time.Now().UTC()

	tx, err := service.storage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	for i, row := range rows {
		if i == 0 { //skip header
			continue
		}

		if len(row) != len(constant.ClassroomCSVHeader) {
			msg := fmt.Sprintf("Incorrect number of columns, expected %d, got %d", len(constant.ClassroomCSVHeader), len(row))
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		id, err := strconv.Atoi(row[1])
		if row[1] != "" && err != nil {
			msg := fmt.Sprintf("invalid '%s' column %s at row %d", row[1], constant.ClassroomCSVHeader[1], i+1)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}
		academicYear, err := strconv.Atoi(row[2])
		if err != nil {
			msg := fmt.Sprintf("invalid '%s' column %s at row %d", row[2], constant.ClassroomCSVHeader[2], i+1)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)

		}

		status := constant.ClassStatus(row[5])
		if status == "" {
			status = constant.Draft
		}

		classEntity, err := service.storage.ClassGetTx(tx, id)
		if err != nil {
			return nil, err
		}
		if id != 0 && classEntity == nil { // have id but not found
			msg := fmt.Sprintf("classroom id %v not found", id)
			return nil, helper.NewHttpError(http.StatusNotFound, &msg)
		}
		if classEntity == nil { //new class
			classEntity = &constant.ClassEntity{
				SchoolId:     in.SchoolId,
				AcademicYear: academicYear,
				Year:         row[3],
				Name:         row[4],
				Status:       status,
				CreatedAt:    now,
				CreatedBy:    in.SubjectId,
				UpdatedAt:    &now,
				UpdatedBy:    &in.SubjectId,
			}

			classroom, err := service.storage.ClassCreateTx(tx, classEntity)
			if err != nil {
				return nil, err
			}

			err = service.PrefillClass(&PrefillClassInput{
				Tx:       tx,
				SchoolId: in.SchoolId,
				ClassId:  classroom.Id,
			})
			if err != nil {
				return nil, err
			}

			continue
		}

		// existing class
		if classEntity.SchoolId != in.SchoolId {
			msg := fmt.Sprintf("Classroom %d at row %d does not belong to school %d", id, i+1, in.SchoolId)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		classEntity.AcademicYear = academicYear
		classEntity.Year = row[3]
		classEntity.Name = row[4]
		classEntity.Status = status
		classEntity.UpdatedAt = &now
		classEntity.CreatedBy = in.SubjectId

		_, err = service.storage.ClassUpdate(tx, classEntity)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return &ClassroomUploadCSVOutput{}, nil
}
