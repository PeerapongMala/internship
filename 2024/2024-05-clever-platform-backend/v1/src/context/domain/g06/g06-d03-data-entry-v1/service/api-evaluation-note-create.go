package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type EvaluationNoteAddRequest struct {
	EvaluationSheetId int    `json:"evaluation_sheet_id" validate:"required"`
	NoteValue         string `json:"note_value" validate:"required"`
	SubjectId         string
}

// ==================== Response ==========================
type EvaluationNoteAddResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationNoteAdd(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationNoteAddRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.EvaluationNoteAdd(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationNoteAddResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationNoteAdd(in *EvaluationNoteAddRequest) error {

	sqlTx, err := service.gradeDataEntryStorage.BeginTx()
	if err != nil {
		return err
	}

	sheet, err := service.gradeDataEntryStorage.EvaluationSheetGetById(in.EvaluationSheetId)
	if err != nil {
		log.Printf("EvaluationSheetGetById err %+v", errors.WithStack(err))
		return err
	}
	if sheet == nil {
		err := fmt.Errorf("evaluation sheet not found")
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	now := time.Now().UTC()
	_, err = service.gradeDataEntryStorage.EvaluationFormNoteInsert(sqlTx, &constant.EvaluationFormNote{
		SheetID:   in.EvaluationSheetId,
		NoteValue: in.NoteValue,
		CreatedAt: now,
		CreatedBy: in.SubjectId,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
