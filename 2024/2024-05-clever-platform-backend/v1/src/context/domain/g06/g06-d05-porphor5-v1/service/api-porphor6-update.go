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
type Porphor6UpdateRequest struct {
	EvaluationFormId int `params:"evaluationFormId" validate:"required"`
	SubjectId        string
	Data             []Porphor6UpdateData `json:"data" validate:"required,dive,required"`
}

type Porphor6UpdateData struct {
	ID       int             `json:"id" validate:"required"`
	DataJson json.RawMessage `json:"data_json" validate:"required"`
}

// ==================== Response ==========================
type Porphor6UpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor6Update(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &Porphor6UpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	err = api.Service.Porphor6Update(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor6UpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor6Update(in *Porphor6UpdateRequest) error {
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
		err = service.gradePorphor5Storage.Porphor6UpdateDataJson(tx, in.EvaluationFormId, v.ID, v.DataJson)
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
