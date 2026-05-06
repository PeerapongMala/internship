package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================
type Porphor5ListRequest struct {
	EvaluationFormId int `params:"evaluationFormId" validate:"required"`
	SubjectId        string
}

// ==================== Response ==========================
type Porphor5ListResponse struct {
	constant.StatusResponse
	Data []constant.Porphor5DataEntity `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor5List(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &Porphor5ListRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	data, err := api.Service.Porphor5List(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor5ListResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: data,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor5List(in *Porphor5ListRequest) ([]constant.Porphor5DataEntity, error) {

	list, err := service.gradePorphor5Storage.GetListPorphor5ByFormID(in.EvaluationFormId)
	if err != nil {
		log.Printf("get list porphor5 error: %+v", err)
		return nil, err
	}
	return list, nil
}
