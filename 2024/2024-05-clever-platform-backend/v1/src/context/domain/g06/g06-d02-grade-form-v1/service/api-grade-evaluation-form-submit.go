package service

import (
	"fmt"
	"log"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	dataEntryConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	constant3 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeEvaluationFormSubmitRequest struct {
	EvaluationFormId int `params:"evaluationFormId" validate:"required"`
	SubjectId        string
}

// ==================== Response ==========================
type GradeEvaluationFormSubmitResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeEvaluationFormSubmit(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeEvaluationFormSubmitRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.GradeEvaluationFormSubmit(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeEvaluationFormSubmitResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeEvaluationFormSubmit(in *GradeEvaluationFormSubmitRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	evaluationForm, err := service.gradeFormStorage.GradeEvaluationFormGetById(in.EvaluationFormId)
	if err != nil {
		log.Printf("get grade evaluation form err: %+v\n", err)
		return fmt.Errorf("get grade evaluation form err: %+v", err)
	}
	if evaluationForm == nil {
		log.Printf("get grade evaluation form nil: %+v\n", in.EvaluationFormId)
		return fmt.Errorf("get grade evaluation form nil: %+v", in.EvaluationFormId)
	}

	err = service.gradeFormStorage.GradeEvaluationFormUpdate(sqlTx, &constant.GradeEvaluationFormEntity{
		Id:     evaluationForm.Id,
		Status: &constant.EFInProgress,
	})
	if err != nil {
		log.Printf("update grade evaluation form err: %+v\n", err)
		return fmt.Errorf("update grade evaluation form err: %+v", err)
	}

	evaluationSheetIds, err := service.gradeFormStorage.EvaluationSheetUpdateStatus(sqlTx, in.EvaluationFormId, &constant.False, constant.ESDraft, constant.ESEnabled, in.SubjectId)
	if err != nil {
		return err
	}

	for _, sheetId := range evaluationSheetIds {
		//create data entry
		now := time.Now().UTC()
		draft := "draft"
		dataEntry := &dataEntryConstant.EvaluationDataEntry{
			SheetID:              sheetId,
			JsonStudentScoreData: "[]", //empty student score
			IsLock:               &constant.False,
			Status:               &draft,
			CreatedAt:            &now,
			CreatedBy:            &in.SubjectId,
			UpdatedAt:            &now,
			UpdatedBy:            &in.SubjectId,
		}

		_, err = service.gradeDataEntryStorage.EvaluationDataEntryInsert(sqlTx, dataEntry)
		if err != nil {
			log.Printf("insert evaluation data entry with sheet id %d error %+v", sheetId, errors.WithStack(err))
			return err
		}
	}

	academicYear, err := strconv.Atoi(helper.Deref(evaluationForm.AcademicYear))
	students, err := service.gradeFormStorage.StudentCaseGetByClass(sqlTx, academicYear, helper.Deref(evaluationForm.Year), helper.Deref(evaluationForm.SchoolRoom))
	if err != nil {
		return err
	}
	evaluationStudents := []constant2.EvaluationStudent{}
	for _, student := range students {
		//maleString := []string{"เด็กชาย", "ด.ช.", "ชาย", "สามเณร", "นาย"}
		femaleString := []string{"เด็กหญิง", "ด.ญ.", "หญิง", "นางสาว"}

		gender := constant3.Male
		if slices.Contains(femaleString, helper.Deref(student.Title)) {
			gender = constant3.Female
		}

		evaluationStudents = append(evaluationStudents, constant2.EvaluationStudent{
			FormID:              in.EvaluationFormId,
			StudentID:           student.StudentID,
			AcademicYear:        evaluationForm.AcademicYear,
			Gender:              &gender,
			Title:               student.Title,
			ThaiFirstName:       student.FirstName,
			ThaiLastName:        student.LastName,
			BirthDate:           helper.ToPtr(student.BirthDate.Format("01/02/2006")),
			Ethnicity:           student.Ethnicity,
			Nationality:         student.Nationality,
			Religion:            student.Religion,
			ParentMaritalStatus: student.ParentMaritalStatus,
			FatherTitle:         student.FatherTitle,
			FatherFirstName:     student.FatherFirstName,
			FatherLastName:      student.FatherLastName,
			MotherTitle:         student.MotherTitle,
			MotherFirstName:     student.MotherFirstName,
			MotherLastName:      student.MotherLastName,
			GuardianRelation:    student.ParentRelationship,
			GuardianTitle:       student.ParentTitle,
			GuardianFirstName:   student.ParentFirstName,
			GuardianLastName:    student.ParentLastName,
			AddressNo:           student.HouseNumber,
			AddressMoo:          student.Moo,
			AddressSubDistrict:  student.SubDistrict,
			AddressDistrict:     student.District,
			AddressProvince:     student.Province,
			AddressPostalCode:   student.PostCode,
		})
	}

	err = service.gradeFormStorage.EvaluationStudentCreate(sqlTx, evaluationStudents)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
