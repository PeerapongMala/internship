package service

import (
	"database/sql"
	"encoding/json"
	"fmt"
	gradeFormConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type EvaluationSheetUpdateRequest struct {
	//*constant.GradeEvaluationFormEntity
	*constant.EvaluationDataEntry
	EvaluationSheetId int `params:"evaluationSheetId" validate:"required"`
	//StudentScore      []constant.StudentScoreData  `json:"student_score" validate:"required,dive,required"`
	SubjectId string
}

// ==================== Response ==========================
type EvaluationSheetUpdateResponse struct {
	constant.StatusResponse
	Data *EvaluationSheetUpdateData `json:"data"`
}

type EvaluationSheetUpdateData struct {
	DataEntryID int `json:"data_entry_id"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationSheetUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	responseData, err := api.Service.EvaluationSheetUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
			Data:       responseData,
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationSheetUpdate(in *EvaluationSheetUpdateRequest) (*EvaluationSheetUpdateData, error) {

	sqlTx, err := service.gradeDataEntryStorage.BeginTx()
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	sheet, err := service.gradeDataEntryStorage.EvaluationSheetGetById(in.EvaluationSheetId)
	if err != nil {
		log.Printf("EvaluationSheetGetById err %+v", errors.WithStack(err))
		return nil, err
	}
	if sheet == nil {
		err := fmt.Errorf("evaluation sheet not found")
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	form, err := service.gradeFormStorage.GradeEvaluationFormGetById(*sheet.FormID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if form == nil {
		err := fmt.Errorf("grade form not found")
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if helper.Deref(form.IsLock) {
		return nil, fmt.Errorf("locked")
	}

	if helper.Deref(sheet.ValueType) == int(constant.General) {
		formGeneralEvaluationId := sheet.EvaluationFormGeneralEvaluationID
		if formGeneralEvaluationId != nil {
			err = service.gradeDataEntryStorage.EvaluationFormGeneralEvaluationUpdate(sqlTx, &constant.GradeEvaluationFormGeneralEvaluationEntity{
				Id:             formGeneralEvaluationId,
				AdditionalData: string(helper.Deref(in.AdditionalData)),
			})
			if err != nil {
				return nil, err
			}
		}
	}

	jsonData, err := json.Marshal(in.StudentScoreData)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if in.EndEditAt == nil {
		in.EndEditAt = &now
	}
	if in.Status == nil {
		in.Status = &constant.Enable
	}

	dataEntry := &constant.EvaluationDataEntry{
		SheetID:              in.EvaluationSheetId,
		JsonStudentScoreData: string(jsonData),
		IsLock:               &constant.False,
		Status:               in.Status,
		CreatedAt:            &now,
		CreatedBy:            &in.SubjectId,
		UpdatedAt:            &now,
		UpdatedBy:            &in.SubjectId,
		StartEditAt:          in.StartEditAt,
		EndEditAt:            in.EndEditAt,
	}

	dataEntryID, err := service.gradeDataEntryStorage.EvaluationDataEntryInsert(sqlTx, dataEntry)
	if err != nil {
		log.Printf("insert evaluation data entry %+v", errors.WithStack(err))
		return nil, err
	}

	sheetStatusDraftList, err := service.gradeDataEntryStorage.EvaluationSheetList(sqlTx, constant.EvaluationSheetListFilter{
		SchoolId: *form.SchoolId,
		FormID:   *sheet.FormID,
		Status:   "enabled",
	}, &helper.Pagination{Page: 1, Limit: sql.NullInt64{Int64: 999999999, Valid: true}, SortBBy: "id", SortOrder: "desc"})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	log.Printf("sheet remaining status enabled is %d (school id %v, form id %v)", len(sheetStatusDraftList), *form.SchoolId, *sheet.FormID)
	if len(sheetStatusDraftList) == 0 { // report available when no sheet with data entry have status draft
		err = service.gradeFormStorage.GradeEvaluationFormUpdate(sqlTx, &gradeFormConstant.GradeEvaluationFormEntity{
			Id:        sheet.FormID,
			Status:    &gradeFormConstant.EFReportAvailable,
			UpdatedAt: &now,
			UpdatedBy: &in.SubjectId,
		})
		if err != nil {
			log.Printf("insert evaluation data entry %+v", errors.WithStack(err))
			return nil, err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return nil, err
	}

	return &EvaluationSheetUpdateData{DataEntryID: dataEntryID}, nil
}
