package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================
type EvaluationSheetRetrieveVersionRequest struct {
	EvaluationSheetId int `params:"evaluationSheetId" validate:"required"`
	DataEntryID       int `json:"data_entry_id" validate:"required"`
	SubjectId         string
}

// ==================== Response ==========================
type EvaluationSheetRetrieveVersionResponse struct {
	constant.StatusResponse
	Data *EvaluationSheetRetrieveVersionData `json:"data"`
}

type EvaluationSheetRetrieveVersionData struct {
	DataEntryID int `json:"data_entry_id"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationSheetRetrieveVersion(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetRetrieveVersionRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	responseData, err := api.Service.EvaluationSheetRetrieveVersion(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetRetrieveVersionResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
			Data:       responseData,
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationSheetRetrieveVersion(in *EvaluationSheetRetrieveVersionRequest) (*EvaluationSheetRetrieveVersionData, error) {

	sqlTx, err := service.gradeDataEntryStorage.BeginTx()
	if err != nil {
		return nil, err
	}

	err = service.gradeDataEntryStorage.EvaluationSheetUpdateCurrentDataEntryID(sqlTx, in.EvaluationSheetId, in.DataEntryID)
	if err != nil {
		log.Printf("update current data entry id %+v", errors.WithStack(err))
		return nil, err
	}

	err = sqlTx.Commit()
	if err != nil {
		return nil, err
	}

	return &EvaluationSheetRetrieveVersionData{DataEntryID: in.DataEntryID}, nil
}
