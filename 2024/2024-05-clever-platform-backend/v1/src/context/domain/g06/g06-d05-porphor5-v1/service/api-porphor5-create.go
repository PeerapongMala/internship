package service

import (
	"fmt"
	gradeFormConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	dataEntryConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"strconv"
	"time"
)

// ==================== Request ==========================
type Porphor5CreateRequest struct {
	Porphor5CreateRequestBody
	EvaluationFormId int `params:"evaluationFormId" validate:"required"`
	SubjectId        string
}

type Porphor5CreateRequestBody struct {
	SubjectTeacher      string `json:"subject_teacher" validate:"required"`
	HeadOfSubject       string `json:"head_of_subject" validate:"required"`
	Principal           string `json:"principal" validate:"required"`
	DeputyDirector      string `json:"deputy_director" validate:"required"`
	Registrar           string `json:"registrar" validate:"required"`
	SignDate            string `json:"sign_date"`
	IssueDate           string `json:"issue_date"`
	DocumentNumberStart string `json:"document_number_start" validate:"required"`
}

// ==================== Response ==========================
type Porphor5CreateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor5Create(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &Porphor5CreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	_, err = strconv.Atoi(request.DocumentNumberStart)
	if err != nil {
		msg := fmt.Sprintf("document_number_start must be an integer %s", request.DocumentNumberStart)
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	now := time.Now()
	if request.SignDate == "" {
		request.SignDate = helper.HandleTimePointerToField(&now)
	}
	if request.IssueDate == "" {
		request.IssueDate = helper.HandleTimePointerToField(&now)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.Porphor5Create(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor5CreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor5Create(in *Porphor5CreateRequest) error {

	form, err := service.gradeFormStorage.GradeEvaluationFormGetById(in.EvaluationFormId)
	if err != nil {
		log.Printf("SubjectInfoBySheetID err %+v", errors.WithStack(err))
		return err
	}
	if form == nil {
		err := fmt.Errorf("evaluation form not found")
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if *form.Status != gradeFormConstant.EFReportAvailable && *form.Status != gradeFormConstant.EFReported {
		err := fmt.Errorf("evaluation form status is invalid, expect %s, got %v", gradeFormConstant.EFReportAvailable, helper.HandleStringPointerField((*string)(form.Status)))
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	sheetsTmp, err := service.gradeDataEntryStorage.EvaluationSheetList(nil, dataEntryConstant.EvaluationSheetListFilter{
		SchoolId: *form.SchoolId,
		FormID:   *form.Id,
		//Year:         "",
		//AcademicYear: "",
		//SchoolRoom:   "",
		//SchoolTerm:   "",
		//Status: string(dataEntryConstant.ESSent),
	}, helper.PaginationDefault())
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	var sheets []dataEntryConstant.EvaluationSheetListEntity
	for _, v := range sheetsTmp {
		if v.Status == nil {
			continue
		}
		if *v.Status == string(dataEntryConstant.ESSent) || *v.Status == string(dataEntryConstant.ESApprove) {
			sheets = append(sheets, v)
		}
	}

	if len(sheets) == 0 {
		err := fmt.Errorf("evaluation sheet not found")
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	data, err := service.prepareDataForPorphor5(in, form, sheets)
	if err != nil {
		log.Printf("prepare data for porphor 5 %+v", errors.WithStack(err))
		return fmt.Errorf("prepare data for porphor 5 : %s", err.Error())
	}

	dataPorphor6, err := service.prepareDataForPorphor6(in, form, sheets)
	if err != nil {
		log.Printf("prepare data for porphor 6 %+v", errors.WithStack(err))
		return fmt.Errorf("prepare data for porphor 6 : %s", err.Error())
	}

	tx, err := service.gradeDataEntryStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.gradePorphor5Storage.Porphor5DataClearAndInsert(tx, data)
	if err != nil {
		log.Printf("porphor 5 data clear data %+v", errors.WithStack(err))
		return fmt.Errorf("porphor 5 data clear data : %s", err.Error())
	}

	err = service.gradePorphor5Storage.Porphor6DataClearAndInsert(tx, dataPorphor6)
	if err != nil {
		log.Printf("porphor 6 data clear data %+v", errors.WithStack(err))
		return fmt.Errorf("porphor 6 data clear data : %s", err.Error())
	}

	now := time.Now()
	err = service.gradeFormStorage.GradeEvaluationFormUpdate(tx, &gradeFormConstant.GradeEvaluationFormEntity{
		Id:        form.Id,
		Status:    &gradeFormConstant.EFReported,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	})
	if err != nil {
		log.Printf("grade form update %+v", errors.WithStack(err))
		return err
	}

	var sheetIDs []int
	for _, sheet := range sheets {
		sheetIDs = append(sheetIDs, sheet.ID)
	}
	err = service.gradeFormStorage.EvaluationSheetUpdateStatusByIDs(tx, sheetIDs, gradeFormConstant.ESApprove, in.SubjectId)
	log.Printf("grade sheet update %+v", errors.WithStack(err))
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
