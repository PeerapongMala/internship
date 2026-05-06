package service

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================
type Porphor5UpdateRequest struct {
	EvaluationFormId int `params:"evaluationFormId" validate:"required"`
	SubjectId        string
	Data             []Porphor5UpdateData `json:"data" validate:"required,dive,required"`
}

type Porphor5UpdateData struct {
	ID       int             `json:"id" validate:"required"`
	DataJson json.RawMessage `json:"data_json" validate:"required"`
}

// ==================== Response ==========================
type Porphor5UpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor5Update(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &Porphor5UpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.Porphor5Update(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor5UpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor5Update(in *Porphor5UpdateRequest) error {
	if len(in.Data) == 0 {
		return nil
	}

	tx, err := service.gradePorphor5Storage.BeginTx()
	if err != nil {
		log.Printf("begin tx %+v", errors.WithStack(err))
		return err
	}
	defer tx.Rollback()

	for _, v := range in.Data {
		err = service.gradePorphor5Storage.Porphor5UpdateDataJson(tx, in.EvaluationFormId, v.ID, v.DataJson)
		if err != nil {
			log.Printf("update data json %+v", errors.WithStack(err))
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("commit tx %+v", errors.WithStack(err))
		return err
	}
	return nil
}
