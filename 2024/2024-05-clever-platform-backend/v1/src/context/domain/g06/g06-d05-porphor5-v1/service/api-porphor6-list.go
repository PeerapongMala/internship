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
type Porphor6ListRequest struct {
	constant.Porphor6ListFilter
	SubjectId string
}

// ==================== Response ==========================
type Porphor6ListResponse struct {
	constant.StatusResponse
	Pagination *helper.Pagination      `json:"_pagination"`
	Data       []constant.Porphor6Data `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor6List(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &Porphor6ListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	data, err := api.Service.Porphor6List(request, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor6ListResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Pagination: pagination,
		Data:       data,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor6List(in *Porphor6ListRequest, pagination *helper.Pagination) ([]constant.Porphor6Data, error) {
	list, err := service.gradePorphor5Storage.GetListPorphor6ByFormID(in.Porphor6ListFilter, pagination)
	if err != nil {
		log.Printf("get list porphor6 error: %+v", err)
		return nil, err
	}
	return list, nil
}
